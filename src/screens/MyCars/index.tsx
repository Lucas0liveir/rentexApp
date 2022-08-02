import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons'
import { BackHandler, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Car as ModelCar } from '../../databases/model/Car';
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
import { LoadAnimation } from '../../components/LoadAnimation';
import { useAuth } from '../../hooks/auth';
import { Car } from '../../databases/model/Car';
import { format, parseISO } from 'date-fns';


interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;
}

export function MyCars() {
    const { user } = useAuth()
    const screenIsFocus = useIsFocused()

    const theme = useTheme()
    const navigation = useNavigation<any>()

    const [cars, setCars] = useState<DataProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get(`/rentals`)
                const dataFormatted = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy')
                    }
                })

                setCars(dataFormatted)
            } catch (e: any) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [screenIsFocus])

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
                                        <CarFooterDate>{item.start_date}</CarFooterDate>
                                        <AntDesign
                                            name='arrowright'
                                            size={20}
                                            color={theme.colors.title}
                                            style={{ marginHorizontal: 10 }}
                                        />
                                        <CarFooterDate>{item.end_date}</CarFooterDate>
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