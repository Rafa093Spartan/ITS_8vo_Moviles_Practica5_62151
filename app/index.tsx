// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import Login from './Login';
import RegisterScreen from './Register';

export default function Index() {
  const router = useRouter();

  return (

      <RegisterScreen onRegisterSuccess={() => router.push('./Login')} />

  );
}