import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { api } from '../services/api';

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isValidEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const register = async () => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!isValidEmail(trimmedUsername)) {
            Alert.alert('Error', 'Ingresa un correo válido');
            return;
        }

        if (trimmedPassword.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            await api.register(trimmedUsername, trimmedPassword);
            router.push('./Login');
        } catch (error: any) {
            Alert.alert('Error en registro', error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#0b0c10', '#1f2833']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.title}>CREA TU CUENTA</Text>

                    <RoundedTextField
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                    />

                    <RoundedTextField
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Contraseña"
                        secureTextEntry
                    />

                    {isLoading ? (
                        <ActivityIndicator color="#66fcf1" style={styles.loading} />
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={register}>
                            <Text style={styles.buttonText}>REGISTRARME</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => router.push('./Login')}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

interface RoundedTextFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: any;
}

const RoundedTextField: React.FC<RoundedTextFieldProps> = ({
                                                               value,
                                                               onChangeText,
                                                               placeholder,
                                                               secureTextEntry = false,
                                                               keyboardType = 'default',
                                                           }) => (
    <View style={styles.textFieldContainer}>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#c5c6c7"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            style={styles.textField}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
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
        textAlign: 'center',
    },
    textFieldContainer: {
        width: '100%',
        marginVertical: 10,
    },
    textField: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 18,
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
    loginText: {
        marginTop: 20,
        color: '#c5c6c7',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    loading: {
        marginTop: 30,
    },
});

export default RegisterScreen;
