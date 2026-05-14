import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { G_DARK } from '../../constants/colors';
import { useLang } from '../../context/LanguageContext';

const C = G_DARK;

export default function GuardianRegisterScreen() {
  const { t } = useLang();
  const [name,         setName]         = useState('');
  const [phone,        setPhone]        = useState('');
  const [password,     setPassword]     = useState('');
  const [relationship, setRelationship] = useState('');
  const [showPass,     setShowPass]     = useState(false);

  const isValid = name.trim().length >= 2
    && phone.trim().length >= 9
    && password.trim().length >= 6;

  function handleNext() {
    if (!isValid) return;
    router.push({
      pathname: '/(auth)/blind-register',
      params: {
        guardianName:  name.trim(),
        guardianPhone: phone.trim().replace(/\s/g, ''),
        password:      password.trim(),
        relationship:  relationship.trim(),
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t('back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('createAccount')}</Text>
      <Text style={styles.subtitle}>{t('personGuiding')}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>{t('yourFullName')}</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sarah Kamau"
          placeholderTextColor={C.muted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>{t('yourPhone')}</Text>
        <TextInput
          style={styles.input}
          placeholder="+250 780 000 000"
          placeholderTextColor={C.muted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>{t('password')}</Text>
        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
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

        <Text style={styles.label}>{t('relationship')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('relationshipHint')}
          placeholderTextColor={C.muted}
          value={relationship}
          onChangeText={setRelationship}
          autoCapitalize="words"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
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
  back:         { marginBottom: 20 },
  backText:     { color: C.accent, fontSize: 15 },
  title:        { color: C.text, fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle:     { color: C.muted, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  form:         { gap: 4 },
  label:        { color: C.muted, fontSize: 13, marginBottom: 4, marginTop: 10 },
  input:        { backgroundColor: C.card, borderRadius: 12, padding: 16, color: C.text, fontSize: 16, borderWidth: 1, borderColor: C.border },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingRight: 12 },
  passwordInput:{ flex: 1, padding: 16, color: C.text, fontSize: 16 },
  eyeBtn:       { padding: 8 },
  button:       { backgroundColor: C.accent, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 32 },
  buttonDisabled: { opacity: 0.4 },
  buttonText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
});
