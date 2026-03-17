const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const players = {
  men: [
    { id: 'm1', name: 'Mostafa Asal', country: 'Egypt', flag: '🇪🇬', ranking: 1, price: 20, pts: 9500 },
    { id: 'm2', name: 'Ali Farag', country: 'Egypt', flag: '🇪🇬', ranking: 2, price: 18, pts: 8900 },
    { id: 'm3', name: 'Paul Coll', country: 'New Zealand', flag: '🇳🇿', ranking: 3, price: 16, pts: 8200 },
    { id: 'm4', name: 'Diego Elias', country: 'Peru', flag: '🇵🇪', ranking: 4, price: 15, pts: 7800 },
    { id: 'm5', name: 'Tarek Momen', country: 'Egypt', flag: '🇪🇬', ranking: 5, price: 14, pts: 7400 },
    { id: 'm6', name: 'Mohamed ElShorbagy', country: 'Egypt', flag: '🇪🇬', ranking: 6, price: 13, pts: 6900 },
    { id: 'm7', name: 'Youssef Ibrahim', country: 'Egypt', flag: '🇪🇬', ranking: 7, price: 12, pts: 6500 },
    { id: 'm8', name: 'Gregoire Marche', country: 'France', flag: '🇫🇷', ranking: 8, price: 11, pts: 6100 },
    { id: 'm9', name: 'Joel Makin', country: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', ranking: 9, price: 10, pts: 5700 },
    { id: 'm10', name: 'Marwan ElShorbagy', country: 'Egypt', flag: '🇪🇬', ranking: 10, price: 9, pts: 5300 },
    { id: 'm11', name: 'Mazen Hesham', country: 'Egypt', flag: '🇪🇬', ranking: 11, price: 8, pts: 4900 },
    { id: 'm12', name: 'Karim Abdel Gawad', country: 'Egypt', flag: '🇪🇬', ranking: 12, price: 8, pts: 4600 },
  ],
  women: [
    { id: 'w1', name: 'Nour El Sherbini', country: 'Egypt', flag: '🇪🇬', ranking: 1, price: 20, pts: 9800 },
    { id: 'w2', name: 'Nouran Gohar', country: 'Egypt', flag: '🇪🇬', ranking: 2, price: 18, pts: 9100 },
    { id: 'w3', name: 'Hania El Hammamy', country: 'Egypt', flag: '🇪🇬', ranking: 3, price: 16, pts: 8400 },
    { id: 'w4', name: 'Nour El Tayeb', country: 'Egypt', flag: '🇪🇬', ranking: 4, price: 15, pts: 7900 },
    { id: 'w5', name: 'Amanda Sobhy', country: 'USA', flag: '🇺🇸', ranking: 5, price: 14, pts: 7300 },
    { id: 'w6', name: 'Camille Serme', country: 'France', flag: '🇫🇷', ranking: 6, price: 13, pts: 6800 },
    { id: 'w7', name: 'Joelle King', country: 'New Zealand', flag: '🇳🇿', ranking: 7, price: 12, pts: 6400 },
    { id: 'w8', name: 'Sarah-Jane Perry', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ranking: 8, price: 11, pts: 5900 },
    { id: 'w9', name: 'Tinne Gilis', country: 'Belgium', flag: '🇧🇪', ranking: 9, price: 10, pts: 5400 },
    { id: 'w10', name: 'Salma Hany', country: 'Egypt', flag: '🇪🇬', ranking: 10, price: 9, pts: 5000 },
    { id: 'w11', name: 'Melissa Alves', country: 'France', flag: '🇫🇷', ranking: 11, price: 8, pts: 4600 },
    { id: 'w12', name: 'Sobhy Rowan', country: 'USA', flag: '🇺🇸', ranking: 12, price: 8, pts: 4300 },
  ]
};

app.get('/api/players', (req, res) => {
  res.json(players);
});

app.listen(PORT, () => {
  console.log(`Fantasy Squash running at http://localhost:${PORT}`);
});
