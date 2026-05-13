import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = '@emboni_accounts';

export interface LocalAccount {
  phone:     string;
  password:  string;
  role:      'guardian' | 'blind';
  name:      string;
  language:  string;
  voiceSpeed:string;
  guardianPhone?: string; // for blind users — links to guardian
}

// Built-in demo accounts always available
const DEMO_ACCOUNTS: LocalAccount[] = [
  { phone: '+250711000001', password: 'guardian123', role: 'guardian', name: 'Sarah Kamau',  language: 'en', voiceSpeed: 'Normal' },
  { phone: '+250711000002', password: 'blind123',    role: 'blind',    name: 'James Kamau',  language: 'en', voiceSpeed: 'Normal', guardianPhone: '+250711000001' },
  { phone: '+250711000000', password: 'admin123',    role: 'guardian', name: 'Admin',        language: 'en', voiceSpeed: 'Normal' },
];

async function getAccounts(): Promise<LocalAccount[]> {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  const saved: LocalAccount[] = raw ? JSON.parse(raw) : [];
  return [...DEMO_ACCOUNTS, ...saved];
}

async function saveAccounts(accounts: LocalAccount[]): Promise<void> {
  // only save non-demo accounts
  const custom = accounts.filter(
    a => !DEMO_ACCOUNTS.some(d => d.phone === a.phone)
  );
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(custom));
}

export async function registerAccount(account: LocalAccount): Promise<void> {
  const all = await getAccounts();
  const exists = all.find(a => a.phone.replace(/\s/g,'') === account.phone.replace(/\s/g,''));
  if (exists) throw new Error('Phone number already registered.');
  const custom = all.filter(a => !DEMO_ACCOUNTS.some(d => d.phone === a.phone));
  custom.push({ ...account, phone: account.phone.replace(/\s/g,'') });
  await saveAccounts(custom);
}

export async function findAccount(phone: string, password: string): Promise<LocalAccount | null> {
  const all = await getAccounts();
  const clean = phone.replace(/\s/g,'').replace(/-/g,'');
  return all.find(a => a.phone.replace(/\s/g,'') === clean && a.password === password) ?? null;
}
