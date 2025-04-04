import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../services/api';

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa correo y contraseña');
            return;
        }
        setIsLoading(true);
        try {
            const token = await api.login(email, password);
            if (token) {
                router.push('/Notas');
            } else {
                throw new Error('Credenciales incorrectas');
            }
        } catch (error: any) {
            Alert.alert('Error', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>INICIAR SESIÓN</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    placeholderTextColor="#ccc"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#ccc"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#0b0c10" />
                    ) : (
                        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('./Register')}>
                    <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0c10',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1f2833',
        padding: 28,
        borderRadius: 20,
        shadowColor: '#45a29e',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#66fcf1',
        marginBottom: 30,
        letterSpacing: 1.2,
    },
    input: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginTop: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#45a29e',
        backgroundColor: '#0b0c10',
        color: '#f0f0f0',
        fontSize: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: '#66fcf1',
        marginTop: 30,
        alignItems: 'center',
        shadowColor: '#66fcf1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#0b0c10',
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 20,
        color: '#c5c6c7',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default Login;
