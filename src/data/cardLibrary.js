// src/data/cardLibrary.js
const importAll = (r) => {
    const images = {};
    r.keys().forEach((key) => {
      const name = key.replace("./", "").replace(".png", "");
      images[name] = r(key);
    });
    return images;
  };
  
  export const cardImages = importAll(
    import.meta.globEager("../assets/cards/*.png")
  );
  
  export const cardData = {
    milei: {
      name: "Javier Milei",
      type: "hero",
      cost: 3,
      damage: 1200,
    },
    sec_murloc: {
      name: "SEC Murloc",
      type: "hero",
      cost: 2,
      damage: 800,
    },
    atrumply2: {
      name: "Atrumply",
      type: "hero",
      cost: 4,
      damage: 1500,
    },
    biffbozo: {
      name: "Biff Bozo",
      type: "hero",
      cost: 2,
      damage: 600,
    },
    buterin: {
      name: "Vitalik Buterin",
      type: "hero",
      cost: 5,
      damage: 1800,
    },
    sbf: {
      name: "Sam Bankman Fried",
      type: "hero",
      cost: 3,
      damage: 1000,
    },
    moonmusk: {
      name: "Moon Musk",
      type: "hero",
      cost: 4,
      damage: 1600,
    },
    booberberg: {
      name: "Booberberg",
      type: "hero",
      cost: 3,
      damage: 1300,
    },
    pixl: {
      name: "Pixl",
      type: "hero",
      cost: 2,
      damage: 700,
    },
    xcom: {
      name: "XCom Overlord",
      type: "hero",
      cost: 6,
      damage: 2000,
    },
  };
  