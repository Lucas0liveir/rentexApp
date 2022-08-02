import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { useTheme } from "styled-components";
import { Feather } from '@expo/vector-icons'
import { BackButton } from "../../components/BackButton";
import {
    Container,
    Header,
    HeaderTitle,
    LogoutButton,
    HeaderTop,
    PhotoContainer,
    Photo,
    PhotoButton,
    Content,
    Options,
    Option,
    OptionTitle,
    Section

} from "./styles";
import * as Yup from 'yup'
import { Input } from "../../components/Input";
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { PasswordInput } from "../../components/PasswordInput";
import { useAuth } from "../../hooks/auth";
import { Button } from "../../components/Button";
import { useNetInfo } from "@react-native-community/netinfo";

export function Profile() {
    const { user, signOut, updateUser } = useAuth()
    const netInfo = useNetInfo()
    const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit')
    const [avatar, setAvatar] = useState(user.avatar)
    const [name, setName] = useState(user.name)
    const [driverLicense, setDriverLicense] = useState(user.driver_license)

    const navigation = useNavigation<any>()
    const theme = useTheme()

    function handleBack() {
        navigation.goBack()
    }

    function handleSignOut() {

        Alert.alert('Tem certeza?',
            'Se você sair, irá precisar de internet para conectar-se novamente.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => { },
                },
                {
                    text: "Sair",
                    onPress: () => signOut()
                }
            ]
        )

    }

    function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {

        if (netInfo.isConnected === false && optionSelected === 'passwordEdit') {
            Alert.alert('Você está offline', 'Para mudar a senha, conecte-de a internet')
        }
        
        setOption(optionSelected)

    }

    async function handleProfileUpdate() {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome é obrigatório'),
                driverLicense: Yup.string().required('CNH é obrigatória'),
            })

            const data = { name, driverLicense }
            await schema.validate(data)

            await updateUser({
                id: user.id,
                user_id: user.user_id,
                email: user.email,
                name,
                driver_license: driverLicense,
                avatar,
                token: user.token
            })

            Alert.alert('Perfil Atualizado')

        } catch (e) {
            if (e instanceof Yup.ValidationError) {
                Alert.alert('opa', e.message)
            } else {
                Alert.alert('Não foi possível atualizar o perfil')
            }

        }
    }

    async function handleSelectAvatar() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        }) as { uri: string, cancelled: boolean }

        if (result.cancelled) return

        if (result.uri) {
            setAvatar(result.uri)
        }
    }
    return (
        <KeyboardAvoidingView
            behavior="position"
            enabled
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <HeaderTop>
                            <BackButton color={theme.colors.shape} onPress={handleBack} />
                            <HeaderTitle>Editar Perfil</HeaderTitle>
                            <LogoutButton onPress={handleSignOut} >
                                <Feather name='power' size={24} color={theme.colors.shape} />
                            </LogoutButton>
                        </HeaderTop>
                        <PhotoContainer>
                            {!!avatar && <Photo source={{ uri: avatar }} />}
                            <PhotoButton onPress={handleSelectAvatar}>
                                <Feather name='camera' size={24} color={theme.colors.shape} />
                            </PhotoButton>
                        </PhotoContainer>
                    </Header>
                    <Content style={{ marginBottom: useBottomTabBarHeight() }}>
                        <Options>
                            <Option
                                onPress={() => handleOptionChange('dataEdit')}
                                active={option === 'dataEdit'}>
                                <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
                            </Option>
                            <Option
                                onPress={() => handleOptionChange('passwordEdit')}
                                active={option === 'passwordEdit'}>
                                <OptionTitle active={option === 'passwordEdit'}>Trocar senha</OptionTitle>
                            </Option>
                        </Options>
                        {option === 'dataEdit' ? (
                            <Section>
                                <Input
                                    iconName="user"
                                    placeholder="Nome"
                                    onChangeText={setName}
                                    autoCorrect={false}
                                    defaultValue={user.name}
                                />
                                <Input
                                    iconName="mail"
                                    editable={false}
                                    defaultValue={user.email}
                                />
                                <Input
                                    iconName="credit-card"
                                    placeholder="CNH"
                                    onChangeText={setDriverLicense}
                                    keyboardType="numeric"
                                    defaultValue={user.driver_license}
                                />
                            </Section>
                        ) : (
                            <Section>
                                <PasswordInput
                                    iconName="lock"
                                    placeholder="Senha atual"
                                />
                                <PasswordInput
                                    iconName="lock"
                                    placeholder="Nova senha"
                                />
                                <PasswordInput
                                    iconName="lock"
                                    placeholder="Repetir senha"
                                />
                            </Section>
                        )

                        }
                        <Button
                            onPress={handleProfileUpdate}
                            title="Salvar alterações"
                        />
                    </Content>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}