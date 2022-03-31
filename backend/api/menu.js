import { v4 as uuidv4 } from "uuid";

export const menu = {
  salads: {
    text: "Salads",
    data: [
      {
        id: uuidv4(),
        name: "Grüner Salat",
        description: "mit Feta",
        price: 5.4,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647228445/cantine/uper-xoriatiki-salata_ufxfsj.jpg",
        extras: [
          {
            type: "select",
            title: "Ihr Dressing",
            options: [
              { price: 0.0, text: "mit American Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
            ],
          },
          {
            type: "multi-checkbox",
            title: "Ihr Dressing",
            options: [
              { price: 0.0, text: "mit American Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Τonno Salat",
        description: "mit Thunfisch",
        price: 6,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647228609/cantine/mediterranean-tuna-salad-31059-1_osblpt.jpg",
        extras: [
          {
            type: "select",
            title: "Ihr Dressing",
            options: [
              { price: 0.0, text: "mit American Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Chicken Salat",
        description: "mit Hähnchenbruststreifen",
        price: 7,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647228750/cantine/Chicken-Salad-5_uihbrn.jpg",
        extras: [
          {
            type: "select",
            title: "Ihr Dressing",
            options: [
              { price: 0.0, text: "mit American Dressing" },
              { price: 0.0, text: "mit Balsamico Dressing" },
              { price: 0.0, text: "mit Joghurt Dressing" },
              { price: 0.0, text: "ohne Dressing" },
            ],
          },
        ],
      },
    ],
  },
  baguettes: {
    text: "Baguettes",
    data: [
      {
        id: uuidv4(),
        name: "Baguette mit Käse",
        price: 4,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229817/cantine/55046723-sub-sandwich-baguette-mit-schinken-k_C3_A4se-tomaten-und-salat-zum-fr_C3_BChst_C3_BCck_ddngm1.jpg",
      },
      {
        id: uuidv4(),
        name: "Baguette Salami",
        price: 4,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647228981/cantine/82861359-frische-crusty-baguette-salami-sandwich-mit-k_C3_A4se-und-salat-zutaten-_C3_BCber-einen-wei_C3_9Fen-hintergrund_phbv55.jpg",
      },
    ],
  },
  schnitzel: {
    text: "Schnitzel",
    data: [
      {
        id: uuidv4(),
        name: "Schnitzel Wiener Art",
        price: 7.9,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229191/cantine/wiener-schnitzel-recipe-1447089-Hero-5b587d6c46e0fb0071b0059d_sszdx0.jpg",
      },
      {
        id: uuidv4(),
        name: "Schnitzel Bacon",
        description: "mit Speck und Zwiebeln und Käse überbacken",
        price: 7.9,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229233/cantine/chicken-schnitzels-bacon-white-wine-sauce-04_gur1hb.jpg",
      },
      {
        id: uuidv4(),
        name: "Schnitzel mit Champignonsauce",
        price: 7.9,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229265/cantine/schnitzel_mit_rahmchampignons_2_fjj3as.jpg",
      },
    ],
  },
  getränke: {
    text: "Getränke",
    data: [
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
      {
        id: uuidv4(),
        name: "Coca-Col 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229408/cantine/coca-cola-24x0-33l-5000112547689_egdw7f.jpg",
      },
      {
        id: uuidv4(),
        name: "Fanta Orange 0,33l",
        price: 1.75,
        photoURL:
          "https://res.cloudinary.com/duvwxquad/image/upload/w_450,h_350,ar_1:1,c_fill,g_auto/v1647229475/cantine/SmartSushi2-015_mw61f7.jpg",
      },
    ],
  },
};
