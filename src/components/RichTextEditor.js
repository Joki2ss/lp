import React, { useMemo, useRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { theme } from '../styles/theme';

function ToolbarButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tbBtn, pressed && styles.tbPressed]}>
      <Text style={styles.tbText}>{label}</Text>
    </Pressable>
  );
}

/**
 * Word-like WYSIWYG editor implemented with a contentEditable surface in WebView.
 *
 * - Stores content as HTML.
 * - Uses document.execCommand for formatting commands (widely supported in WebViews).
 * - Snack/Expo compatible via `react-native-webview`.
 */
export function RichTextEditor({ valueHtml, onChangeHtml, placeholder = 'Write…', minHeight = 320 }) {
  const webRef = useRef(null);
  const lastHtmlRef = useRef(valueHtml || '');

  const editorHtml = useMemo(() => {
    // We intentionally keep the HTML simple and self-contained.
    const initial = valueHtml || '';
    const safeInitial = String(initial)
      .replaceAll('\\', '\\\\')
      .replaceAll('`', '\\`')
      .replaceAll('${', '\\${');

    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          :root { color-scheme: dark; }
          body {
            margin: 0;
            padding: 0;
            background: ${theme.colors.bg};
            color: ${theme.colors.text};
            font-family: -apple-system, Segoe UI, Roboto, Arial;
          }
          #root {
            padding: 14px;
          }
          #editor {
            min-height: ${Math.max(120, minHeight)}px;
            outline: none;
            background: ${theme.colors.card};
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.radius.md}px;
            padding: 12px;
            font-size: 16px;
            line-height: 1.5;
          }
          #editor:empty:before {
            content: attr(data-placeholder);
            color: ${theme.colors.muted};
          }
          p { margin: 0 0 10px; }
          h1,h2,h3 { margin: 0 0 10px; }
          ul,ol { margin: 0 0 10px 22px; }
          blockquote {
            margin: 0 0 10px;
            padding-left: 12px;
            border-left: 3px solid ${theme.colors.border};
            color: ${theme.colors.muted};
          }
          a { color: ${theme.colors.brand}; }
        </style>
      </head>
      <body>
        <div id="root">
          <div id="editor" contenteditable="true" data-placeholder="${escapeAttribute(placeholder)}"></div>
        </div>
        <script>
          (function () {
            const editor = document.getElementById('editor');

            function post(type, payload) {
              if (!window.ReactNativeWebView) return;
              window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
            }

            function setHtml(html) {
              editor.innerHTML = html || '';
            }

            function getHtml() {
              return editor.innerHTML || '';
            }

            // Initial content
            setHtml(\`${safeInitial}\`);

            let t = null;
            function scheduleEmit() {
              if (t) clearTimeout(t);
              t = setTimeout(() => {
                post('change', { html: getHtml() });
              }, 120);
            }

            editor.addEventListener('input', scheduleEmit);
            editor.addEventListener('blur', () => post('blur', { html: getHtml() }));

            window.__sxr = {
              cmd: function (name, value) {
                editor.focus();
                try {
                  document.execCommand(name, false, value);
                } catch (e) {}
                scheduleEmit();
              },
              setHtml: function (html) {
                setHtml(html);
                scheduleEmit();
              },
              getHtml: function () {
                return getHtml();
              },
              createLink: function () {
                editor.focus();
                const url = prompt('Link URL');
                if (url) {
                  try { document.execCommand('createLink', false, url); } catch (e) {}
                  scheduleEmit();
                }
              }
            };

            // Tell RN we are ready
            post('ready', { html: getHtml() });
          })();
        </script>
      </body>
    </html>
    `;
  }, [minHeight, placeholder, valueHtml]);

  const inject = (js) => {
    // Ensure statements end properly; WebView ignores incomplete statements.
    webRef.current?.injectJavaScript(`${js}; true;`);
  };

  const exec = (command, value) => {
    const v = value == null ? 'null' : JSON.stringify(value);
    inject(`window.__sxr && window.__sxr.cmd(${JSON.stringify(command)}, ${v})`);
  };

  const onMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg?.type === 'ready' || msg?.type === 'change' || msg?.type === 'blur') {
        const html = msg?.payload?.html ?? '';
        lastHtmlRef.current = html;
        onChangeHtml?.(html);
      }
    } catch {
      // ignore
    }
  };

  // If parent updates valueHtml (selecting a different draft), push to WebView.
  // We do a light check to avoid looping on our own updates.
  if ((valueHtml || '') !== (lastHtmlRef.current || '')) {
    lastHtmlRef.current = valueHtml || '';
    // On web, WebView injection can be delayed; keep it best-effort.
    setTimeout(() => inject(`window.__sxr && window.__sxr.setHtml(${JSON.stringify(valueHtml || '')})`), 0);
  }

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbar}>
        <ToolbarButton label="B" onPress={() => exec('bold')} />
        <ToolbarButton label="I" onPress={() => exec('italic')} />
        <ToolbarButton label="U" onPress={() => exec('underline')} />
        <View style={styles.sep} />
        <ToolbarButton label="H1" onPress={() => exec('formatBlock', 'h1')} />
        <ToolbarButton label="H2" onPress={() => exec('formatBlock', 'h2')} />
        <ToolbarButton label="P" onPress={() => exec('formatBlock', 'p')} />
        <View style={styles.sep} />
        <ToolbarButton label="• List" onPress={() => exec('insertUnorderedList')} />
        <ToolbarButton label="1. List" onPress={() => exec('insertOrderedList')} />
        <View style={styles.sep} />
        <ToolbarButton label="Left" onPress={() => exec('justifyLeft')} />
        <ToolbarButton label="Center" onPress={() => exec('justifyCenter')} />
        <ToolbarButton label="Right" onPress={() => exec('justifyRight')} />
        <View style={styles.sep} />
        <ToolbarButton label="Link" onPress={() => inject('window.__sxr && window.__sxr.createLink()')} />
        <View style={styles.sep} />
        <ToolbarButton label="Undo" onPress={() => exec('undo')} />
        <ToolbarButton label="Redo" onPress={() => exec('redo')} />
        <ToolbarButton label="Clear" onPress={() => exec('removeFormat')} />
      </ScrollView>

      <View style={[styles.editorFrame, { minHeight }]}>
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          source={{ html: editorHtml }}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
          keyboardDisplayRequiresUserAction={false}
          // Some platforms benefit from explicit background; keep it consistent.
          style={{ backgroundColor: theme.colors.bg }}
          // Web-specific settings
          {...(Platform.OS === 'web' ? { setSupportMultipleWindows: false } : null)}
        />
      </View>
    </View>
  );
}

function escapeAttribute(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  toolbar: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  tbBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tbPressed: { opacity: 0.85 },
  tbText: { color: theme.colors.text, fontWeight: '800', fontSize: 13 },
  sep: { width: 1, height: 28, backgroundColor: theme.colors.border, alignSelf: 'center' },
  editorFrame: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
  },
});
