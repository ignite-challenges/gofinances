import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from "victory-native";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from "styled-components/native";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityIndicator } from 'react-native';

import { useAuth } from '../../hooks/auth';

import { HistoryCard } from '../../components/HistoryCard';
import { TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container, 
  Header, 
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles';

import { categories } from '../../utils/categories';

interface CategoryData {
  name: string,
  total: number,
  totalFormatted: string,
  color: string,
  key: string;
  percent: string;
}

export function Resume() {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  
  const handleDateChange = useCallback((action: 'next' | 'previous') => {
    if(action === 'next'){
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }, [selectedDate]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const expensives = transactions
      .filter((transaction: TransactionCardProps) => 
        transaction.type === 'negative' &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
      );

    const expensivesTotal = expensives
      .reduce((acumullator: number, expensive: TransactionCardProps) => {
        return acumullator + Number(expensive.amount)
      }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionCardProps) => {
        if(expensive.category === category.key)
        categorySum += Number(expensive.amount);
      });

      if(categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }, [selectedDate, user.id]);

  useEffect(() => {
    loadData();
  }, [loadData, selectedDate, isFocused]);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? 
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer> :
        <Content>
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange("previous")}>
              <MonthSelectIcon name='chevron-left' />
            </MonthSelectButton>
            <Month>
              {format(selectedDate, 'MMMM, yyyy', {
                locale: ptBR
              })}
            </Month>  
            <MonthSelectButton onPress={() => handleDateChange("next")}>
              <MonthSelectIcon name='chevron-right' />
            </MonthSelectButton>
          </MonthSelect>
          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="total"
              colorScale={categories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={50}
            />
          </ChartContainer>
          {totalByCategories.map(category =>
            <HistoryCard 
              key={category.key}
              title={category.name}
              amount={category.totalFormatted}
              color={category.color}
            />  
          )}
        </Content>
      }
    </Container>
  );
};

