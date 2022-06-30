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
import { useNavigation } from '@react-navigation/native';


export function SchedulingComplete() {

    const { width } = useWindowDimensions()

    const navigation = useNavigation<any>()

    function hanleConfirm() {
        navigation.navigate('Home')
      }
    

    return (
        <Container>
            <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'}/>
            <LogoBrandSvg
                width={width}
            />
            <Content>
                <DoneSvg width={80} height={80} />
                <Title>Carro Alugado!</Title>

                <Message>
                    Agora você só precisa ir {'\n'}
                    até a concessionária da RENTX {'\n'}
                    pegar o seu automóvel.
                </Message>
            </Content>

            <Footer>
                <ConfirmButton onPress={hanleConfirm} title='OK'/>
            </Footer>
        </Container>
    );
}