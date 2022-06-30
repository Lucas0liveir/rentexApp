import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'react-native';
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
  CarList,
  MyCarsButton
} from './styles';
import { Load } from '../../components/Load';
import { useTheme } from 'styled-components';

export function Home() {
  const theme = useTheme()
  const navigation = useNavigation<any>()
  const [cars, setCars] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true)

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars')
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/cars')
        setCars(response.data)
      } catch (e: any) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, []);

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
          <TotalCars>
            {`Total de ${cars.length} Carros`}
          </TotalCars>
        </HeaderContent>
      </Header>
      {loading ? <Load /> :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Car onPress={() => handleCarDetails(item)} data={item} />}
        />
      }

      <MyCarsButton
        onPress={handleOpenMyCars}
      >
        <Ionicons
          size={32}
          name='ios-car-sport'
          color={theme.colors.shape}
        />

      </MyCarsButton>

    </Container>
  );
}