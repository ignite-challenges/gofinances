import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ActivityIndicator } from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { useTheme } from 'styled-components/native';
import { useAuth } from "../../hooks/auth";

import { HighlightCard } from "../../components/HighlightCard";
import { 
  TransactionCard, 
  TransactionCardProps 
} from "../../components/TransactionCard";

import { 
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
 id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const theme = useTheme();
  const isFocused = useIsFocused()
  const { signOut, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const getLastTransactionDate = useCallback(
    (collection: DataListProps[], type: 'positive' | 'negative') => {
    const collectionFilttered = collection
      .filter((transaction) => transaction.type === type)

    if(collectionFilttered.length === 0){
      return 0;
    }

    const lastTransactionDate = new Date(
      Math.max.apply(Math, 
        collectionFilttered
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );
    

    return `${lastTransactionDate.toLocaleString('pt-BR', {
        day: '2-digit',
      })} de ${lastTransactionDate.toLocaleString('pt-BR', { month: 'long' })}`;
  
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      const dataKey = `@gofinances:transactions_user${user.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensiveTotal = 0;

      const formattedTransactions: DataListProps[] = transactions.map(
        (transaction: DataListProps) => {

          const amount = Number(transaction.amount)
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

          const date = Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit', 
          }).format(new Date(transaction.date));

          if(transaction.type === "positive") {
            entriesTotal += Number(transaction.amount);
          } else {
            expensiveTotal += Number(transaction.amount);
          }

          return {
            id: transaction.id,
            name: transaction.name,
            type: transaction.type,
            category: transaction.category,
            amount,
            date
          };
        }
      );

      setTransactions(formattedTransactions);

      const lastTransactionEntrie = getLastTransactionDate(
        transactions, 'positive'
      );
      
      const lastTransactionExpensive = getLastTransactionDate(
        transactions, 'negative'
      );

      const totalIntervalTrasactions = lastTransactionExpensive !== 0 
        ? `01 a ${lastTransactionExpensive}` 
        : 'Não há transações';

      const total = entriesTotal - expensiveTotal;

      setHighlightData({
        entries:{ 
          amount: entriesTotal
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
            lastTransaction: lastTransactionEntrie !== 0 
              ? `Última entrada dia ${lastTransactionEntrie}`
              : 'Não há transaçoes'
        },
        expensive:{ 
          amount: expensiveTotal
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
            lastTransaction: lastTransactionExpensive !== 0 
              ? `Última saída dia ${lastTransactionExpensive}` 
              : 'Não há transaçoes'
        },
        total: {
          amount: total
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
          lastTransaction: totalIntervalTrasactions
        }
      })

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Alert.alert('Não foi possivel carregar as transações.');
    }
  }, [getLastTransactionDate, user.id]);

  useEffect(() =>{ 
    loadTransactions();
  },[loadTransactions, isFocused]);

  return (
    <Container>
      {isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
        :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard 
              type="up"
              title="Entradas" 
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard 
              type="down"
              title="Saídas" 
              amount={highlightData.expensive.amount}
              lastTransaction={highlightData.expensive.lastTransaction}
            /> 
            <HighlightCard 
              type="total"
              title="Total" 
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
              data={transactions.reverse()}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} /> }
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
