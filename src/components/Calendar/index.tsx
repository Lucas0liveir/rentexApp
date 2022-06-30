import React from 'react';
import { Calendar as CustomCalendar, LocaleConfig, CalendarProps } from 'react-native-calendars'
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';
import { ptBR } from './LocaleConfig';

LocaleConfig.locales['pt-br'] = ptBR

LocaleConfig.defaultLocale = 'pt-br'

const Icon = styled<any>(Feather)``

interface DayProps {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
}

function Calendar({ markedDates, onDayPress }: CalendarProps) {
    const theme = useTheme()
    return (
        <CustomCalendar
            markingType='period'
            markedDates={markedDates}
            onDayPress={onDayPress}
            minDate={new Date().toISOString()}
            firstDay={1}
            theme={{
                textDayFontFamily: theme.fonts.primary_400,
                textDayHeaderFontFamily: theme.fonts.primary_500,
                textMonthFontFamily: theme.fonts.secondary_600,
                textDayHeaderFontSize: 10,
                textMonthFontSize: 20,
                monthTextColor: theme.colors.title,
                arrowStyle: {
                    marginHorizontal: -15
                }
            }}
            headerStyle={{
                backgroundColor: theme.colors.background_secondary,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colors.text_detail,
                paddingBottom: 10,
                marginBottom: 10
            }}
            renderArrow={(direction) =>
                <Icon
                    name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                    size={24}
                    color={theme.colors.text}
                />
            }
        >

        </CustomCalendar>
    );
}

export {
    Calendar,
    DayProps
}