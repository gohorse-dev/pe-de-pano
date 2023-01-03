import fetch from 'node-fetch';

// Teste
export function Teste(){
    return 'Oi, eu sou o Pé de Pano.'
}


// Pixza
export async function getPixzaPrice(){
  const dominosData = await getDominosData()
  const tiles = dominosData.homeTiles.tiles;
  let price = 0;

  Object.values(tiles).forEach((tile, index) => {
    if (tile.linkCode == "BYOM" && tile.images.side && price === 0) {   
      price = tile.images.side.alt.match(/R\$\s*?\d+[,.]\d{2}/)[0];
    }
  });

  return `Hoje a cotação da PiXza está em ${price}.`;
}

async function getDominosData(){
  const res = await fetch('https://cache.dominos.com/wam/prod/market/BR/_pt/dpz.wam.js')
  .then((res) => res.text());

  const data = (res.substring(41)).substring(0,res.substring(41).length-4)

  return JSON.parse(data);
}

