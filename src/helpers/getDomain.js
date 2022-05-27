import { isProduction } from 'helpers/isProduction';

export const getDomain = () => {
  const prodUrl = 'https://sopra22-group11-thegame-server.herokuapp.com/';
  const devUrl = 'http://localhost:8081';

  return isProduction() ? prodUrl : devUrl;
};
export const getDomain2 = () => {
  const prodUrl = 'https://zoom-thegame-server.herokuapp.com/';

  return prodUrl;
};
