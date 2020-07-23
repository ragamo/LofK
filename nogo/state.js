module.exports = {
  player: {
    stats: {
      str: 10,
      dex: 10,
      int: 10,
      // tln: 10,
      // vit: 10,
    },
    weapon: {
      name: 'Ancient Blade',
      type: 'Sword',
      attackType: 'Physical',
      bonuses: {
        crit: '5%',
      },
      abilities: [{
        name: 'Strike',
        rolls: 1,
        maxDmg: 28,
        target: 'single',
      }, {
        name: 'Flaming swing',
        rolls: 2,
        maxDmg: 42,
        target: 'splash',
      }],
    },
  },
};
