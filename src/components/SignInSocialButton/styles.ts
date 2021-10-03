import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

export const Button = styled(RectButton)`
  height: ${RFValue(56)}px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
  /* padding: 10px 12px; */
  margin-bottom: 16px;
`;

export const ImageContainer = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: ${RFValue(16)}px;
  border-color: ${({ theme }) => theme.colors.background};
  border-right-width: 1px;
`;

export const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.text_dark};
  font-size: ${RFValue(14)}px;
`;