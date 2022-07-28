import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo'

import { Alert, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Logo from '../../assets/logo.svg'
import { Car } from '../../components/Car';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';


export function Home() {
  const navigation = useNavigation<any>()
  const netInfo = useNetInfo()
  const [cars, setCars] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true)

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  useEffect(() => {
    let isMounted = true

    async function fetchCars() {
      try {
        const response = await api.get('/cars')
        if (isMounted)
          setCars(response.data)
      } catch (e: any) {
        console.log(e)
      } finally {
        if (isMounted)
          setLoading(false)
      }
    }

    fetchCars()
    return () => {
      isMounted = false
    }
  }, []);

  useEffect(() => {
    if (netInfo.isConnected) {
      Alert.alert('Conectado')
    } else {
      Alert.alert('Desconectado')
    }
  }, [netInfo.isConnected])

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        backgroundColor={'transparent'}
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          {!loading && <TotalCars>
            {`Total de ${cars.length} Carros`}
          </TotalCars>

          }
        </HeaderContent>
      </Header>
      {loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Car onPress={() => handleCarDetails(item)} data={item} />}
        />
      }
    </Container>
  );
}
