import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import LogoBrandSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg'
import {
    Container,
    Content,
    Title,
    Message,
    Footer,
} from './styles';
import { ConfirmButton } from '../../components/ConfirmButton';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Params {
    title: string;
    message: string;
    nextScreenRoute: string;
}

export function Confirmation() {

    const { width } = useWindowDimensions()

    const route = useRoute()
    const navigation = useNavigation<any>()
    const { title, message, nextScreenRoute } = route.params as Params
    
    function hanleConfirm() {
        navigation.navigate(nextScreenRoute)
    }


    return (
        <Container>
            <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} />
            <LogoBrandSvg
                width={width}
            />
            <Content>
                <DoneSvg width={80} height={80} />
                <Title>{title}</Title>

                <Message>
                    {message}
                </Message>
            </Content>

            <Footer>
                <ConfirmButton onPress={hanleConfirm} title='OK' />
            </Footer>
        </Container>
    );
}