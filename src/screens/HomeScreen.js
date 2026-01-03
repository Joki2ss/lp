import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';
import { APP_NAME, ROLES } from '../utils/constants';
import { useT } from '../i18n/t';

const BG = require('../../assets/inMedia/bg.png');

function RoleButton({ title, subtitle, badge, badgeStyle, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.roleBtn,
        pressed ? { transform: [{ translateX: 3 }, { scale: 0.99 }], opacity: 0.98 } : null,
      ]}
    >
      <View style={styles.roleBtnContent}>
        <View style={[styles.roleBadge, badgeStyle]}>
          <View style={styles.roleBadgeTopGlow} />
          <Text style={styles.roleBadgeText}>{badge}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleBtnTitle}>{title}</Text>
          <Text style={styles.roleBtnSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.roleArrow}>→</Text>
    </Pressable>
  );
}

function SignupModal({ visible, role, onClose, onSubmit }) {
  const { t } = useT();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const roleLabel = useMemo(() => {
    if (role === ROLES.ADMIN) return t('admin');
    if (role === ROLES.STAFF) return t('staff');
    if (role === ROLES.CUSTOMER) return t('customer');
    return '';
  }, [role, t]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{roleLabel}</Text>
          <Text style={styles.modalMuted}>Signup (test mode): email/mobile can be empty.</Text>

          <View style={{ gap: theme.spacing.sm }}>
            <View>
              <Text style={styles.inputLabel}>Display name (optional)</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="e.g. Alex"
                placeholderTextColor={theme.colors.muted}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Email (optional)</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. you@example.com"
                placeholderTextColor={theme.colors.muted}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Mobile (optional)</Text>
              <TextInput
                value={mobile}
                onChangeText={setMobile}
                placeholder="e.g. +39 3xx xxx xxxx"
                placeholderTextColor={theme.colors.muted}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.modalActions}>
            <Pressable onPress={onClose} style={[styles.actionBtn, styles.actionBtnMuted]}>
              <Text style={styles.actionBtnTextMuted}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onSubmit({ displayName, email, mobile })}
              style={[styles.actionBtn, styles.actionBtnPrimary]}
            >
              <Text style={styles.actionBtnTextPrimary}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function HomeScreen() {
  const { t } = useT();
  const { state, setRole, setProfile } = useAppStore();
  const [signupRole, setSignupRole] = useState(null);
  const { width } = useWindowDimensions();
  const isWide = width >= 920;

  const onPickRole = (role) => {
    setSignupRole(role);
  };

  const onSubmit = ({ displayName, email, mobile }) => {
    if (!signupRole) return;
    setRole(signupRole);
    setProfile({
      displayName: displayName?.trim() || null,
      email: email?.trim() || null,
      mobile: mobile?.trim() || null,
    });
    setSignupRole(null);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.split, !isWide ? styles.splitStack : null]}>
        <View style={[styles.leftPanel, !isWide ? styles.leftPanelStack : null]}>
          <ImageBackground source={BG} resizeMode="cover" style={styles.leftBg}>
            <View style={styles.leftGradient} />
            <View style={styles.leftGlow1} />
            <View style={styles.leftGlow2} />
            <View style={styles.branding}>
              <Text style={styles.brandLogo}>SXR</Text>
              <Text style={styles.brandSubtitle}>MANAGEMENT SUITE</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.rightPanel, !isWide ? styles.rightPanelStack : null]}>
          <View style={styles.formWrap}>
            <View style={styles.welcome}>
              <Text style={styles.welcomeTitle}>Sign in to continue</Text>
              <Text style={styles.welcomeSubtitle}>Select your access level to proceed</Text>
            </View>

            <Text style={styles.roleLabel}>Access level</Text>
            <View style={{ gap: 12 }}>
              <RoleButton
                title={t('admin')}
                subtitle="Administrator"
                badge="A"
                badgeStyle={styles.badgeAdmin}
                onPress={() => onPickRole(ROLES.ADMIN)}
              />
              <RoleButton
                title={t('staff')}
                subtitle="Staff member"
                badge="S"
                badgeStyle={styles.badgeStaff}
                onPress={() => onPickRole(ROLES.STAFF)}
              />
              <RoleButton
                title={t('customer')}
                subtitle="Customer portal (free)"
                badge="C"
                badgeStyle={styles.badgeCustomer}
                onPress={() => onPickRole(ROLES.CUSTOMER)}
              />
            </View>

            <Text style={styles.footerText}>Current: {state.session.role}</Text>
          </View>
        </View>
      </View>

      <SignupModal
        visible={!!signupRole}
        role={signupRole}
        onClose={() => setSignupRole(null)}
        onSubmit={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  split: { flex: 1, flexDirection: 'row' },
  splitStack: { flexDirection: 'column' },

  leftPanel: { flex: 1, minHeight: '100%' },
  leftPanelStack: { minHeight: 240 },
  leftBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  leftGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    opacity: 0.86,
  },
  leftGlow1: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: 'rgba(59,130,246,0.18)',
    top: -180,
    right: -180,
  },
  leftGlow2: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 360,
    backgroundColor: 'rgba(99,102,241,0.12)',
    bottom: -120,
    left: -120,
  },
  branding: { alignItems: 'center', paddingHorizontal: 24 },
  brandLogo: { fontSize: 54, fontWeight: '900', color: '#fff', letterSpacing: -2 },
  brandSubtitle: { marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,0.70)', letterSpacing: 3, fontWeight: '400' },

  rightPanel: { flex: 1, backgroundColor: theme.colors.card, justifyContent: 'center', padding: 24 },
  rightPanelStack: { paddingVertical: 28 },
  formWrap: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  welcome: { marginBottom: 18 },
  welcomeTitle: { fontSize: 28, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.6 },
  welcomeSubtitle: { marginTop: 8, fontSize: 14, color: theme.colors.muted },
  roleLabel: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  roleBtn: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  roleBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  roleBadgeTopGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  roleBadgeText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  badgeAdmin: { backgroundColor: '#2563EB' },
  badgeStaff: { backgroundColor: '#7C3AED' },
  badgeCustomer: { backgroundColor: '#0891B2' },
  roleBtnTitle: { color: theme.colors.text, fontSize: 15, fontWeight: '900' },
  roleBtnSubtitle: { marginTop: 4, color: theme.colors.muted, fontSize: 13 },
  roleArrow: { color: '#94A3B8', fontSize: 20, marginLeft: 12 },
  footerText: { marginTop: 18, textAlign: 'center', fontSize: 12, color: theme.colors.muted },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalTitle: { ...theme.typography.h2, color: theme.colors.text },
  modalMuted: { color: theme.colors.muted },
  inputLabel: { color: theme.colors.muted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    color: theme.colors.text,
    backgroundColor: theme.colors.card2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderWidth: 1,
  },
  actionBtnMuted: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card2,
  },
  actionBtnPrimary: {
    borderColor: theme.colors.brand,
    backgroundColor: theme.colors.brand,
  },
  actionBtnTextMuted: { color: theme.colors.text, fontWeight: '700' },
  actionBtnTextPrimary: { color: '#fff', fontWeight: '800' },
});
