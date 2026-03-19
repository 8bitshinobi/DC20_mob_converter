// --- DATA TABLES ---

const CR_TO_LEVEL = {
    0: "Novice", 0.125: "Level 1", 0.25: "Level 1", 0.5: "Level 2", 1: "Level 2",
    2: "Level 3", 3: "Level 4", 4: "Level 5", 5: "Level 6", 6: "Level 7",
    7: "Level 8", 8: "Level 9", 9: "Level 10", 10: "Level 11", 11: "Level 12",
    12: "Level 13", 13: "Level 14", 14: "Level 15", 15: "Level 16", 16: "Level 17",
    17: "Level 18", 18: "Level 19", 19: "Level 20", 20: "Level 21"
};

const DEFAULT_BASE_STATS = {
    "Novice":{hp:5,pd:10,ad:10,attack:2,damage:1,saveDC:12,speed:5,prime:2,cm:0,totalFeaturePower:0},
    "Level 1":{hp:10,pd:12,ad:12,attack:4,damage:1.5,saveDC:14,speed:5,prime:2,cm:1,totalFeaturePower:1},
    "Level 2":{hp:13,pd:12,ad:12,attack:4,damage:2,saveDC:14,speed:5,prime:3,cm:1,totalFeaturePower:1},
    "Level 3":{hp:15,pd:13,ad:13,attack:5,damage:3,saveDC:15,speed:5,prime:3,cm:1,totalFeaturePower:2},
    "Level 4":{hp:18,pd:14,ad:14,attack:6,damage:3.5,saveDC:16,speed:5,prime:3,cm:2,totalFeaturePower:2},
    "Level 5":{hp:21,pd:15,ad:15,attack:7,damage:4,saveDC:17,speed:5,prime:3,cm:2,totalFeaturePower:3},
    "Level 6":{hp:24,pd:16,ad:16,attack:8,damage:4.5,saveDC:18,speed:5,prime:4,cm:3,totalFeaturePower:3},
    "Level 7":{hp:27,pd:17,ad:17,attack:9,damage:5,saveDC:19,speed:5,prime:4,cm:3,totalFeaturePower:4},
    "Level 8":{hp:30,pd:18,ad:18,attack:10,damage:5.5,saveDC:20,speed:5,prime:4,cm:4,totalFeaturePower:4},
    "Level 9":{hp:33,pd:19,ad:19,attack:11,damage:6,saveDC:21,speed:5,prime:4,cm:4,totalFeaturePower:5},
    "Level 10":{hp:36,pd:20,ad:20,attack:12,damage:6.5,saveDC:22,speed:5,prime:4,cm:5,totalFeaturePower:5},
    "Level 11":{hp:39,pd:21,ad:21,attack:13,damage:7,saveDC:23,speed:5,prime:5,cm:5,totalFeaturePower:5},
    "Level 12":{hp:42,pd:22,ad:22,attack:14,damage:7.5,saveDC:24,speed:5,prime:5,cm:6,totalFeaturePower:6},
    "Level 13":{hp:45,pd:23,ad:23,attack:15,damage:8,saveDC:25,speed:5,prime:5,cm:6,totalFeaturePower:6},
    "Level 14":{hp:48,pd:24,ad:24,attack:16,damage:8.5,saveDC:26,speed:5,prime:5,cm:7,totalFeaturePower:7},
    "Level 15":{hp:51,pd:25,ad:25,attack:17,damage:9,saveDC:27,speed:5,prime:6,cm:7,totalFeaturePower:7},
    "Level 16":{hp:54,pd:26,ad:26,attack:18,damage:9.5,saveDC:28,speed:5,prime:6,cm:8,totalFeaturePower:8},
    "Level 17":{hp:57,pd:27,ad:27,attack:19,damage:10,saveDC:29,speed:5,prime:6,cm:8,totalFeaturePower:8},
    "Level 18":{hp:60,pd:28,ad:28,attack:20,damage:10.5,saveDC:30,speed:5,prime:6,cm:9,totalFeaturePower:9},
    "Level 19":{hp:63,pd:29,ad:29,attack:21,damage:11,saveDC:31,speed:5,prime:6,cm:9,totalFeaturePower:9},
    "Level 20":{hp:66,pd:30,ad:30,attack:22,damage:11.5,saveDC:32,speed:5,prime:7,cm:10,totalFeaturePower:10},
    "Level 21":{hp:69,pd:31,ad:31,attack:23,damage:12,saveDC:33,speed:5,prime:7,cm:10,totalFeaturePower:10}
};

const DEFAULT_MODIFIERS = {
    "Novice":{
        "N-Easy":{hp:-4,pd:-1,ad:-2,attack:-1,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "N-Medium":{hp:-3,pd:0,ad:-2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "N-Hard":{hp:-3,pd:1,ad:-2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 0":{
        "0-Easy":{hp:-4,pd:-1,ad:-2,attack:-1,damage:0,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "0-Medium":{hp:-2,pd:0,ad:-2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "0-Hard":{hp:0,pd:1,ad:-2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 1":{
        "1-Minion":{hp:-9,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "1-Easy":{hp:-5,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "1-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "1-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "1-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "1-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 2":{
        "2-Minion":{hp:-11,pd:-2,ad:-3,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "2-Easy":{hp:-9,pd:-1,ad:-2,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "2-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "2-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "2-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "2-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 3":{
        "3-Minion":{hp:-12,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "3-Easy":{hp:-10,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "3-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "3-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "3-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "3-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 4":{
        "4-Minion":{hp:-13,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "4-Easy":{hp:-11,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "4-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "4-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "4-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "4-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 5":{
        "5-Minion":{hp:-14,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "5-Easy":{hp:-12,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "5-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "5-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "5-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "5-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 6":{
        "6-Minion":{hp:-15,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "6-Easy":{hp:-13,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "6-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "6-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "6-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "6-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 7":{
        "7-Minion":{hp:-16,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "7-Easy":{hp:-14,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "7-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "7-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "7-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "7-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 8":{
        "8-Minion":{hp:-17,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "8-Easy":{hp:-15,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "8-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "8-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "8-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "8-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 9":{
        "9-Minion":{hp:-18,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "9-Easy":{hp:-16,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "9-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "9-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "9-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "9-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 10":{
        "10-Minion":{hp:-19,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "10-Easy":{hp:-17,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "10-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "10-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "10-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "10-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 11":{
        "11-Minion":{hp:-20,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "11-Easy":{hp:-18,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "11-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "11-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "11-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "11-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 12":{
        "12-Minion":{hp:-21,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "12-Easy":{hp:-19,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "12-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "12-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "12-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "12-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 13":{
        "13-Minion":{hp:-22,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "13-Easy":{hp:-20,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "13-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "13-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "13-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "13-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 14":{
        "14-Minion":{hp:-23,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "14-Easy":{hp:-21,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "14-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "14-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "14-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "14-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 15":{
        "15-Minion":{hp:-24,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "15-Easy":{hp:-22,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "15-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "15-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "15-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "15-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 16":{
        "16-Minion":{hp:-25,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "16-Easy":{hp:-23,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "16-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "16-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "16-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "16-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 17":{
        "17-Minion":{hp:-26,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "17-Easy":{hp:-24,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "17-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "17-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "17-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "17-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 18":{
        "18-Minion":{hp:-27,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "18-Easy":{hp:-25,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "18-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "18-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "18-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "18-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 19":{
        "19-Minion":{hp:-28,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "19-Easy":{hp:-26,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "19-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "19-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "19-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "19-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 20":{
        "20-Minion":{hp:-29,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "20-Easy":{hp:-27,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "20-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "20-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "20-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "20-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    },
    "Level 21":{
        "21-Minion":{hp:-30,pd:-2,ad:-4,attack:-2,damage:-0.5,saveDC:-1,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "21-Easy":{hp:-28,pd:-1,ad:-3,attack:-1,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "21-Medium":{hp:0,pd:0,ad:0,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "21-Hard":{hp:5,pd:2,ad:2,attack:0,damage:0,saveDC:0,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "21-Boss":{hp:10,pd:4,ad:4,attack:2,damage:1,saveDC:2,speed:0,prime:0,cm:0,totalFeaturePower:0},
        "21-Solo":{hp:15,pd:4,ad:4,attack:4,damage:2,saveDC:4,speed:2,prime:0,cm:0,totalFeaturePower:0}
    }
};