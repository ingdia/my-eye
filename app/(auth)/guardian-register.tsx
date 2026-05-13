import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { G_DARK } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';

const C = G_DARK;

export default function GuardianRegisterScreen() {
  const { t } = useLang();
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone]               = useState('');
  const [password, setPassword]         = useState('');
  const [blindUserName, setBlindUserName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showPass, setShowPass]         = useState(false);

  const isValid = guardianName.trim() && phone.trim() && password.trim() && blindUserName.trim();

  function handleNext() {
    if (!isValid) return;
    // Pass guardian data + blind user name to the next screen via params.
    // The actual API call happens at the end of blind-register.
    router.push({
      pathname: '/(auth)/blind-register',
      params: {
        guardianName:  guardianName.trim(),
        guardianPhone: phone.trim(),
        password:      password.trim(),
        blindUserName: blindUserName.trim(),
        relationship:  relationship.trim(),
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={[styles.backText, { color: C.accent }]}>← {t('back')}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: C.text }]}>{t('createAccount')}</Text>
      <Text style={[styles.subtitle, { color: C.muted }]}>{t('personGuiding')}</Text>

      {/* Guardian details */}
      <Text style={[styles.sectionLabel, { color: C.muted }]}>{t('yourDetails')}</Text>
      <View style={styles.section}>
        <Text style={[styles.label, { color: C.muted }]}>{t('yourFullName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sarah Kamau"
          placeholderTextColor={C.muted}
          value={guardianName}
          onChangeText={setGuardianName}
        />

        <Text style={[styles.label, { color: C.muted }]}>{t('yourPhone')}</Text>
        <TextInput
          style={styles.input}
          placeholder="+250 700 000 000"
          placeholderTextColor={C.muted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={[styles.label, { color: C.muted }]}>{t('password')}</Text>
        <View style={styles.passwordWrap}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder={t('createPassword')}
            placeholderTextColor={C.muted}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(p => !p)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
        <Text style={[styles.dividerText, { color: C.muted }]}>{t('personGuiding')}</Text>
        <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
      </View>

      {/* Blind user details */}
      <Text style={[styles.sectionLabel, { color: C.muted }]}>{t('blindUserDetails')}</Text>
      <View style={styles.section}>
        <Text style={[styles.label, { color: C.muted }]}>{t('theirName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. James Kamau"
          placeholderTextColor={C.muted}
          value={blindUserName}
          onChangeText={setBlindUserName}
        />

        <Text style={[styles.label, { color: C.muted }]}>{t('relationship')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('relationshipHint')}
          placeholderTextColor={C.muted}
          value={relationship}
          onChangeText={setRelationship}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: C.accent }, !isValid && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>{t('nextPrefs')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { flexGrow: 1, backgroundColor: C.background, padding: 28, paddingTop: 60, paddingBottom: 40 },
  back:         { marginBottom: 16 },
  backText:     { fontSize: 15 },
  title:        { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle:     { fontSize: 14, lineHeight: 22, marginBottom: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8, marginTop: 8 },
  section:      { gap: 4, marginBottom: 8 },
  label:        { fontSize: 13, marginBottom: 4 },
  input:        { backgroundColor: C.card, borderRadius: 12, padding: 16, color: C.text, fontSize: 16, borderWidth: 1, borderColor: C.border, marginBottom: 14 },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, marginBottom: 14, paddingRight: 12 },
  eyeBtn:       { padding: 8 },
  divider:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine:  { flex: 1, height: 1 },
  dividerText:  { fontSize: 12 },
  button:       { borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.4 },
  buttonText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
});
