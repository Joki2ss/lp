import React, { useMemo, useState } from 'react';
import { ImageBackground, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';
import { APP_NAME, ROLES } from '../utils/constants';
import { useT } from '../i18n/t';

const BG = require('../../assets/inMedia/bg.png');

function RoleCard({ title, subtitle, onPress, variant = 'default' }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.roleCard,
        variant === 'primary' ? styles.roleCardPrimary : styles.roleCardDefault,
        pressed ? { transform: [{ scale: 0.99 }], opacity: 0.98 } : null,
      ]}
    >
      <View style={styles.roleCardTopGlow} />
      <Text style={styles.roleCardTitle}>{title}</Text>
      <Text style={styles.roleCardSubtitle}>{subtitle}</Text>
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
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View style={styles.bgOverlay} />
      <ScreenContainer>
        <View style={styles.hero}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>Choose profile type to preview role-based views</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>{t('role')}</Text>
          <Text style={styles.muted}>Current: {state.session.role}</Text>
          <View style={styles.grid}>
            <RoleCard
              title={t('admin')}
              subtitle="Full suite (includes Editor)"
              variant="primary"
              onPress={() => onPickRole(ROLES.ADMIN)}
            />
            <RoleCard
              title={t('staff')}
              subtitle="Work inbox + operations"
              onPress={() => onPickRole(ROLES.STAFF)}
            />
            <RoleCard
              title={t('customer')}
              subtitle="Free: dashboard, messages, notifications"
              onPress={() => onPickRole(ROLES.CUSTOMER)}
            />
          </View>
        </View>

        <SignupModal
          visible={!!signupRole}
          role={signupRole}
          onClose={() => setSignupRole(null)}
          onSubmit={onSubmit}
        />
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.bg,
    opacity: 0.82,
  },
  hero: { gap: 8, marginBottom: theme.spacing.xl },
  title: { ...theme.typography.title, color: theme.colors.text },
  subtitle: { color: theme.colors.muted },
  section: { gap: theme.spacing.sm },
  h2: { ...theme.typography.h2, color: theme.colors.text },
  muted: { color: theme.colors.muted },
  grid: { gap: theme.spacing.sm },
  roleCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  roleCardTopGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  roleCardPrimary: {
    borderColor: theme.colors.brand,
  },
  roleCardDefault: {},
  roleCardTitle: { color: theme.colors.text, fontWeight: '900', fontSize: 16 },
  roleCardSubtitle: { color: theme.colors.muted, marginTop: 6 },
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
