export const models = [
  {
    value: {
      model: {
        nodes: [
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 0,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 1,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 2,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 3,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 4,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 5,
          },
          {
            bias: 0.3818321883841115,
            type: "hidden",
            squash: "ABSOLUTE",
            mask: 1,
            index: 6,
          },
          {
            bias: -0.03528178506738776,
            type: "output",
            squash: "LOGISTIC",
            mask: 1,
            index: 7,
          },
          {
            bias: 0.05603620352626612,
            type: "output",
            squash: "LOGISTIC",
            mask: 1,
            index: 8,
          },
          {
            bias: -1.7608861323771328,
            type: "output",
            squash: "LOGISTIC",
            mask: 1,
            index: 9,
          },
        ],
        connections: [
          {
            weight: 0.24077857539351755,
            from: 5,
            to: 9,
            gater: null,
          },
          {
            weight: 1.2612914407378026,
            from: 4,
            to: 9,
            gater: null,
          },
          {
            weight: 0.787045848885949,
            from: 5,
            to: 8,
            gater: null,
          },
          {
            weight: -0.17644351067972686,
            from: 6,
            to: 7,
            gater: null,
          },
          {
            weight: 2.3261937131212527,
            from: 3,
            to: 9,
            gater: null,
          },
          {
            weight: 0.024659209845771593,
            from: 4,
            to: 8,
            gater: null,
          },
          {
            weight: 0.787045848885949,
            from: 5,
            to: 7,
            gater: null,
          },
          {
            weight: 2.631058862110869,
            from: 2,
            to: 9,
            gater: null,
          },
          {
            weight: 2.3261937131212527,
            from: 3,
            to: 8,
            gater: null,
          },
          {
            weight: 1.547755060897112,
            from: 4,
            to: 7,
            gater: null,
          },
          {
            weight: 0.0036319567921980767,
            from: 5,
            to: 6,
            gater: null,
          },
          {
            weight: 1.9177054619639826,
            from: 1,
            to: 9,
            gater: null,
          },
          {
            weight: 0.3196089589883586,
            from: 2,
            to: 8,
            gater: null,
          },
          {
            weight: 0.0029137439641588464,
            from: 4,
            to: 6,
            gater: null,
          },
          {
            weight: 1.0364359685977769,
            from: 1,
            to: 8,
            gater: null,
          },
          {
            weight: 0.3196089589883586,
            from: 2,
            to: 7,
            gater: null,
          },
          {
            weight: 0.09320528291248562,
            from: 3,
            to: 6,
            gater: null,
          },
          {
            weight: 2.219019465395743,
            from: 0,
            to: 8,
            gater: null,
          },
          {
            weight: 1.0364359685977769,
            from: 1,
            to: 7,
            gater: null,
          },
          {
            weight: 2.4049651568220676,
            from: 0,
            to: 7,
            gater: null,
          },
          {
            weight: 0.059867445223124566,
            from: 1,
            to: 6,
            gater: null,
          },
          {
            weight: -0.05921091411926227,
            from: 0,
            to: 6,
            gater: null,
          },
        ],
        input: 6,
        output: 3,
        dropout: 0,
      },
      config: {
        displaySize: {
          x: 100,
          y: 100,
        },
        initialSnakeLength: 4,
        growWhenEating: true,
        moveAwayScore: -1.5,
        moveTowardsScore: 1,
        showGraphLog: true,
        populationSize: 50,
        elitismPercent: 10,
        borderWalls: true,
        canEatSelf: true,
        hiddenNodes: 1,
        foodScore: 10,
        gridSize: 5,
      },
    },
    recommended: false,
    description: "Pre-trained Model 1",
  },
  {
    value: {
      model: {
        nodes: [
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 0,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 1,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 2,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 3,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 4,
          },
          {
            bias: 0,
            type: "input",
            squash: "LOGISTIC",
            mask: 1,
            index: 5,
          },
          {
            bias: 0.3818321883841115,
            type: "hidden",
            squash: "ABSOLUTE",
            mask: 1,
            index: 6,
          },
          {
            bias: -0.03528178506738776,
            type: "output",
            squash: "LOGISTIC",
            mask: 1,
            index: 7,
          },
          {
            bias: 0.05603620352626612,
            type: "output",
            squash: "LOGISTIC",
            mask: 1,
            index: 8,
          },
          {
            bias: -1.7608861323771328,
            type: "output",
            squash: "LOGISTIC",
            mask: 1,
            index: 9,
          },
        ],
        connections: [
          {
            weight: 0.24077857539351755,
            from: 5,
            to: 9,
            gater: null,
          },
          {
            weight: 1.2612914407378026,
            from: 4,
            to: 9,
            gater: null,
          },
          {
            weight: 0.787045848885949,
            from: 5,
            to: 8,
            gater: null,
          },
          {
            weight: -0.17644351067972686,
            from: 6,
            to: 7,
            gater: null,
          },
          {
            weight: 2.3261937131212527,
            from: 3,
            to: 9,
            gater: null,
          },
          {
            weight: 0.024659209845771593,
            from: 4,
            to: 8,
            gater: null,
          },
          {
            weight: 0.787045848885949,
            from: 5,
            to: 7,
            gater: null,
          },
          {
            weight: 2.631058862110869,
            from: 2,
            to: 9,
            gater: null,
          },
          {
            weight: 2.3261937131212527,
            from: 3,
            to: 8,
            gater: null,
          },
          {
            weight: 1.547755060897112,
            from: 4,
            to: 7,
            gater: null,
          },
          {
            weight: 0.0036319567921980767,
            from: 5,
            to: 6,
            gater: null,
          },
          {
            weight: 1.9177054619639826,
            from: 1,
            to: 9,
            gater: null,
          },
          {
            weight: 0.3196089589883586,
            from: 2,
            to: 8,
            gater: null,
          },
          {
            weight: 0.0029137439641588464,
            from: 4,
            to: 6,
            gater: null,
          },
          {
            weight: 1.0364359685977769,
            from: 1,
            to: 8,
            gater: null,
          },
          {
            weight: 0.3196089589883586,
            from: 2,
            to: 7,
            gater: null,
          },
          {
            weight: 0.09320528291248562,
            from: 3,
            to: 6,
            gater: null,
          },
          {
            weight: 2.219019465395743,
            from: 0,
            to: 8,
            gater: null,
          },
          {
            weight: 1.0364359685977769,
            from: 1,
            to: 7,
            gater: null,
          },
          {
            weight: 2.4049651568220676,
            from: 0,
            to: 7,
            gater: null,
          },
          {
            weight: 0.059867445223124566,
            from: 1,
            to: 6,
            gater: null,
          },
          {
            weight: -0.05921091411926227,
            from: 0,
            to: 6,
            gater: null,
          },
        ],
        input: 6,
        output: 3,
        dropout: 0,
      },
      config: {
        displaySize: {
          x: 100,
          y: 100,
        },
        initialSnakeLength: 4,
        growWhenEating: true,
        moveAwayScore: -1.5,
        moveTowardsScore: 1,
        showGraphLog: true,
        populationSize: 50,
        elitismPercent: 10,
        borderWalls: true,
        canEatSelf: true,
        hiddenNodes: 1,
        foodScore: 10,
        gridSize: 5,
      },
    },
    recommended: false,
    description: "Pre-trained Model 2",
  },
];
