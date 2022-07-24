import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons'
import { BackHandler, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import {
    Container,
    Header,
    Title,
    Subtitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate,
} from './styles';
import { Load } from '../../components/Load';
import { LoadAnimation } from '../../components/LoadAnimation';
import { useAuth } from '../../hooks/auth';

interface CarProps {
    id: string;
    user_id: string;
    car: CarDTO;
    startDate: string;
    endDate: string;
}

export function MyCars() {
    const { user } = useAuth()

    const theme = useTheme()
    const navigation = useNavigation<any>()

    const [cars, setCars] = useState<CarProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get(`/rental`)
                setCars(response.data)
            } catch (e: any) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    return (
        <Container>
            <Header>
                <BackButton
                    onPress={() => { navigation.goBack() }}
                    color={theme.colors.shape}
                />

                <Title>
                    Seus agendamentos, {'\n'}
                    estão aqui.
                </Title>
                <Subtitle>Conforto, segurança e praticidade</Subtitle>
            </Header>

            <Content>
                <Appointments>
                    <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                    <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                </Appointments>
                {loading ? <LoadAnimation /> :
                    <FlatList
                        data={cars}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CarWrapper>
                                <Car data={item.car} />
                                <CarFooter>
                                    <CarFooterTitle>Período</CarFooterTitle>
                                    <CarFooterPeriod>
                                        <CarFooterDate>{item.startDate}</CarFooterDate>
                                        <AntDesign
                                            name='arrowright'
                                            size={20}
                                            color={theme.colors.title}
                                            style={{ marginHorizontal: 10 }}
                                        />
                                        <CarFooterDate>{item.endDate}</CarFooterDate>
                                    </CarFooterPeriod>
                                </CarFooter>
                            </CarWrapper>

                        )}
                    />
                }

            </Content>
        </Container>
    );
}