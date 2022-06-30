import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import ArrowSvg from '../../assets/arrow.svg'
import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateValue,
  DateTitle,
  Content,
  Footer,
} from './styles';
import { StatusBar } from 'react-native';
import { Button } from '../../components/Button';
import { Calendar, DayProps } from '../../components/Calendar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateInterval, MarkedDatesType } from '../../components/Calendar/generateInterval';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { format } from 'date-fns';
import { CarDTO } from '../../dtos/CarDTO';


interface Params {
  car: CarDTO
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string
}

export function Scheduling() {

  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps)
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({} as MarkedDatesType)
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)

  const route = useRoute()
  const { car } = route.params as Params

  const theme = useTheme()
  const navigation = useNavigation<any>()

  function hanleConfirmRental() {

    navigation.navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates)
    })

  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end
      end = start
    }
    setLastSelectedDate(end)
    const interval = generateInterval(start, end)
    setMarkedDates(interval)

    const firstDate = Object.keys(interval)[0]
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1]


    setRentalPeriod({
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
  }

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor={'transparent'}
      />
      <Header>
        <BackButton
          onPress={() => { navigation.goBack() }}
          color={theme.colors.shape}
        />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>
              {rentalPeriod.startFormatted}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.endFormatted}
            </DateValue>
          </DateInfo>

        </RentalPeriod>
      </Header>
      <Content>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>
      <Footer>
        <Button
          onPress={hanleConfirmRental}
          title='Confirmar'
          enabled={!!rentalPeriod.startFormatted}
        />
      </Footer>

    </Container>
  );
}