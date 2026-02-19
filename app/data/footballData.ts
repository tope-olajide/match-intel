
export interface Team {
  name: string;
}

export interface League {
  name: string;
  code: string;
  teams: string[];
}

export const footballData: Record<string, League[]> = {
  England: [
    {
      name: "Premier League",
      code: "E0",
      teams: [
        "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
        "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
        "Leicester City", "Liverpool", "Manchester City", "Manchester United",
        "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
        "West Ham United", "Wolves"
      ].sort()
    },
    {
      name: "Championship",
      code: "E1",
      teams: [
        "Blackburn Rovers", "Bristol City", "Burnley", "Cardiff City", "Coventry City",
        "Derby County", "Hull City", "Leeds United", "Luton Town", "Middlesbrough",
        "Millwall", "Norwich City", "Oxford United", "Plymouth Argyle", "Portsmouth",
        "Preston North End", "Queens Park Rangers", "Sheffield United", "Sheffield Wednesday",
        "Stoke City", "Sunderland", "Swansea City", "Watford", "West Bromwich Albion"
      ].sort()
    },
    {
      name: "League One",
      code: "E2",
      teams: [
        "Barnsley", "Birmingham City", "Blackpool", "Bolton Wanderers", "Bristol Rovers",
        "Burton Albion", "Cambridge United", "Charlton Athletic", "Crawley Town",
        "Exeter City", "Huddersfield Town", "Leyton Orient", "Lincoln City",
        "Mansfield Town", "Northampton Town", "Peterborough United", "Reading",
        "Rotherham United", "Shrewsbury Town", "Stevenage", "Stockport County",
        "Wigan Athletic", "Wrexham", "Wycombe Wanderers"
      ].sort()
    },
    {
      name: "League Two",
      code: "E3",
      teams: [
        "Accrington Stanley", "AFC Wimbledon", "Barrow", "Bradford City", "Bromley",
        "Carlisle United", "Cheltenham Town", "Chesterfield", "Colchester United",
        "Crewe Alexandra", "Doncaster Rovers", "Fleetwood Town", "Gillingham",
        "Grimsby Town", "Harrogate Town", "Milton Keynes Dons", "Morecambe",
        "Newport County", "Notts County", "Port Vale", "Salford City",
        "Swindon Town", "Tranmere Rovers", "Walsall"
      ].sort()
    },
    {
      name: "National League",
      code: "EC",
      teams: [
        "Aldershot Town", "Altrincham", "Barnet", "Boston United", "Braintree Town",
        "Dagenham & Redbridge", "Eastleigh", "Ebbsfleet United", "FC Halifax Town",
        "Forest Green Rovers", "Fylde", "Gateshead", "Hartlepool United",
        "Maidenhead United", "Oldham Athletic", "Rochdale", "Solihull Moors",
        "Southend United", "Sutton United", "Tamworth", "Wealdstone", "Woking",
        "Yeovil Town", "York City"
      ].sort()
    }
  ],
  Scotland: [
    {
      name: "Premiership",
      code: "SC0",
      teams: [
        "Aberdeen", "Celtic", "Dundee", "Dundee United", "Heart of Midlothian",
        "Hibernian", "Kilmarnock", "Motherwell", "Rangers", "Ross County",
        "St Johnstone", "St Mirren"
      ].sort()
    },
    {
      name: "Championship",
      code: "SC1",
      teams: [
        "Airdrieonians", "Ayr United", "Dunfermline Athletic", "Falkirk",
        "Greenock Morton", "Hamilton Academical", "Livingston", "Partick Thistle",
        "Queen's Park", "Raith Rovers"
      ].sort()
    },
    {
      name: "League One",
      code: "SC2",
      teams: [
        "Alloa Athletic", "Annan Athletic", "Arbroath", "Cove Rangers",
        "Dumbarton", "Inverness Caledonian Thistle", "Kelty Hearts",
        "Montrose", "Queen of the South", "Stenhousemuir"
      ].sort()
    },
    {
      name: "League Two",
      code: "SC3",
      teams: [
        "Bonnyrigg Rose", "Clyde", "East Fife", "Edinburgh City", "Elgin City",
        "Forfar Athletic", "Peterhead", "Spartans", "Stirling Albion", "Stranraer"
      ].sort()
    }
  ],
  Germany: [
    {
      name: "Bundesliga",
      code: "D1",
      teams: [
        "Augsburg", "Bayer Leverkusen", "Bayern Munich", "Bochum", "Borussia Dortmund",
        "Borussia Monchengladbach", "Eintracht Frankfurt", "Freiburg", "Heidenheim",
        "Hoffenheim", "Holstein Kiel", "Mainz 05", "RB Leipzig", "St. Pauli",
        "Stuttgart", "Union Berlin", "Werder Bremen", "Wolfsburg"
      ].sort()
    },
    {
      name: "2. Bundesliga",
      code: "D2",
      teams: [
        "Braunschweig", "Darmstadt 98", "Elversberg", "Fortuna Dusseldorf", "Greuther Furth",
        "Hamburg", "Hannover 96", "Hertha Berlin", "Jahn Regensburg", "Kaiserslautern",
        "Karlsruhe", "Koln", "Magdeburg", "Munster", "Nurnberg", "Paderborn",
        "Schalke 04", "Ulm"
      ].sort()
    }
  ],
  Italy: [
    {
      name: "Serie A",
      code: "I1",
      teams: [
        "AC Milan", "Atalanta", "Bologna", "Cagliari", "Como", "Empoli",
        "Fiorentina", "Genoa", "Inter Milan", "Juventus", "Lazio", "Lecce",
        "Monza", "Napoli", "Parma", "Roma", "Torino", "Udinese", "Venezia", "Verona"
      ].sort()
    },
    {
      name: "Serie B",
      code: "I2",
      teams: [
        "Bari", "Brescia", "Carrarese", "Catanzaro", "Cesena", "Cittadella",
        "Cosenza", "Cremonese", "Frosinone", "Juve Stabia", "Mantova",
        "Modena", "Palermo", "Pisa", "Reggiana", "Salernitana", "Sampdoria",
        "Sassuolo", "Spezia", "Sudtirol"
      ].sort()
    }
  ],
  Spain: [
    {
      name: "La Liga",
      code: "SP1",
      teams: [
        "Alaves", "Athletic Bilbao", "Atletico Madrid", "Barcelona", "Celta Vigo",
        "Espanyol", "Getafe", "Girona", "Las Palmas", "Leganes", "Mallorca",
        "Osasuna", "Rayo Vallecano", "Real Betis", "Real Madrid", "Real Sociedad",
        "Sevilla", "Valencia", "Valladolid", "Villarreal"
      ].sort()
    },
    {
      name: "Segunda Division",
      code: "SP2",
      teams: [
        "Albacete", "Almeria", "Burgos", "Cadiz", "Cartagena", "Castellon",
        "Cordoba", "Deportivo La Coruna", "Eibar", "Elche", "Eldense",
        "Ferrol", "Granada", "Huesca", "Levante", "Mirandes", "Oviedo",
        "Racing Santander", "Sporting Gijon", "Tenerife", "Zaragoza"
      ].sort()
    }
  ],
  France: [
    {
      name: "Ligue 1",
      code: "F1",
      teams: [
        "Angers", "Auxerre", "Brest", "Le Havre", "Lens", "Lille", "Lyon",
        "Marseille", "Monaco", "Montpellier", "Nantes", "Nice", "PSG",
        "Reims", "Rennes", "Saint-Etienne", "Strasbourg", "Toulouse"
      ].sort()
    },
    {
      name: "Ligue 2",
      code: "F2",
      teams: [
        "Ajaccio", "Amiens", "Annecy", "Bastia", "Caen", "Clermont",
        "Dunkerque", "Grenoble", "Guingamp", "Laval", "Lorient", "Martigues",
        "Metz", "Paris FC", "Pau", "Red Star", "Rodez", "Troyes"
      ].sort()
    }
  ],
  Netherlands: [
    {
      name: "Eredivisie",
      code: "N1",
      teams: [
        "Ajax", "Almere City", "AZ Alkmaar", "Feyenoord", "Fortuna Sittard",
        "Go Ahead Eagles", "Groningen", "Heerenveen", "Heracles Almelo",
        "NAC Breda", "NEC Nijmegen", "PEC Zwolle", "PSV Eindhoven",
        "RKC Waalwijk", "Sparta Rotterdam", "Twente", "Utrecht", "Willem II"
      ].sort()
    }
  ],
  Belgium: [
    {
      name: "Jupiler League",
      code: "B1",
      teams: [
        "Anderlecht", "Antwerp", "Beerschot", "Cercle Brugge", "Charleroi",
        "Club Brugge", "Dender", "Genk", "Gent", "Kortrijk", "Mechelen",
        "OH Leuven", "Sint-Truiden", "Standard Liege", "Union SG", "Westerlo"
      ].sort()
    }
  ],
  Portugal: [
    {
      name: "Liga Portugal",
      code: "P1",
      teams: [
        "Arouca", "AVS", "Benfica", "Boavista", "Braga", "Casa Pia",
        "Estoril", "Estrela", "Famalicao", "Farense", "Gil Vicente",
        "Moreirense", "Nacional", "Porto", "Rio Ave", "Santa Clara",
        "Sporting CP", "Vitoria de Guimaraes"
      ].sort()
    }
  ],
  Turkey: [
    {
      name: "Super Lig",
      code: "T1",
      teams: [
        "Adana Demirspor", "Alanyaspor", "Antalyaspor", "Besiktas", "Bodrum",
        "Caykur Rizespor", "Eyupspor", "Fenerbahce", "Galatasaray", "Gaziantep",
        "Goztepe", "Hatayspor", "Istanbul Basaksehir", "Kasimpasa", "Kayserispor",
        "Konyaspor", "Samsunspor", "Sivasspor", "Trabzonspor"
      ].sort()
    }
  ],
  Greece: [
    {
      name: "Super League",
      code: "G1",
      teams: [
        "AEK Athens", "Aris", "Asteras Tripolis", "Atromitos", "Athens Kallithea",
        "Lamia", "Levadiakos", "OFI Crete", "Olympiacos", "Panathinaikos",
        "Panetolikos", "PAOK", "Panserraikos", "Volos"
      ].sort()
    }
  ],
  Argentina: [
    {
      name: "Primera Division",
      code: "ARG",
      teams: [
        "Argentinos Jrs", "Atletico Tucuman", "Banfield", "Barracas Central",
        "Belgrano", "Boca Juniors", "Central Cordoba", "Defensa y Justicia",
        "Deportivo Riestra", "Estudiantes L.P.", "Gimnasia L.P.", "Godoy Cruz",
        "Huracan", "Independiente", "Independiente Rivadavia", "Instituto",
        "Lanust", "Newells Old Boys", "Platense", "Racing Club", "Riestra",
        "River Plate", "Rosario Central", "San Lorenzo", "Sarmiento",
        "Talleres Cordoba", "Tigre", "Union de Santa Fe", "Velez Sarsfield"
      ].sort()
    }
  ],
  Austria: [
    {
      name: "Bundesliga",
      code: "AUT",
      teams: [
        "Altach", "Austria Klagenfurt", "Austria Vienna", "BW Linz",
        "GAK", "Hartberg", "LASK", "Rapid Vienna", "RB Salzburg",
        "Strum Graz", "Wolfsberger AC", "WSG Tirol"
      ].sort()
    }
  ],
  Brazil: [
    {
      name: "Serie A",
      code: "BRA",
      teams: [
        "Athletico-PR", "Atletico-GO", "Atletico-MG", "Bahia", "Botafogo",
        "Corinthians", "Criciuma", "Cruzeiro", "Cuiaba", "Flamengo",
        "Fluminense", "Fortaleza", "Gremio", "Internacional", "Juventude",
        "Palmeiras", "Red Bull Bragantino", "Sao Paulo", "Vasco da Gama", "Vitoria"
      ].sort()
    }
  ],
  China: [
    {
      name: "Super League",
      code: "CHN",
      teams: [
        "Beijing Guoan", "Changchun Yatai", "Chengdu Rongcheng", "Henan",
        "Meizhou Hakka", "Nantong Zhiyun", "Qingdao Hainiu", "Qingdao West Coast",
        "Shandong Taishan", "Shanghai Port", "Shanghai Shenhua", "Shenzhen Peng City",
        "Tianjin Jinmen Tiger", "Wuhan Three Towns", "Zhejiang Pro", "Cangzhou Mighty Lions"
      ].sort()
    }
  ],
  Denmark: [
    {
      name: "Superliga",
      code: "DNK",
      teams: [
        "AaB", "AGF", "Brondby", "FC Copenhagen", "FC Midtjylland",
        "FC Nordsjaelland", "Lyngby", "Randers FC", "Silkeborg",
        "Sonderjyske", "Vejle", "Viborg"
      ].sort()
    }
  ],
  Finland: [
    {
      name: "Veikkausliiga",
      code: "FIN",
      teams: [
        "AC Oulu", "Ekenas", "Gnistan", "Haka", "HJK", "IFK Mariehamn",
        "Ilves", "Inter Turku", "KuPS", "Lahti", "SJK", "VPS"
      ].sort()
    }
  ],
  Ireland: [
    {
      name: "Premier Division",
      code: "IRL",
      teams: [
        "Bohemians", "Derry City", "Drogheda", "Dundalk", "Galway",
        "Shamrock Rovers", "Shelbourne", "Sligo Rovers", "St. Patricks", "Waterford"
      ].sort()
    }
  ],
  Japan: [
    {
      name: "J-League",
      code: "JPN",
      teams: [
        "Albirex Niigata", "Avispa Fukuoka", "Cerezo Osaka", "FC Tokyo",
        "Gamba Osaka", "Hokkaido Consadole Sapporo", "Jubilo Iwata",
        "Kashima Antlers", "Kashiwa Reysol", "Kawasaki Frontale",
        "Kyoto Sanga", "Machida Zelvia", "Nagoya Grampus", "Sagan Tosu",
        "Sanfrecce Hiroshima", "Shonan Bellmare", "Tokyo Verdy",
        "Urawa Red Diamonds", "Vissel Kobe", "Yokohama F. Marinos"
      ].sort()
    }
  ],
  Mexico: [
    {
      name: "Liga MX",
      code: "MEX",
      teams: [
        "America", "Atlas", "Atletico San Luis", "Cruz Azul", "Guadalajara",
        "Juarez", "Leon", "Mazatlan", "Monterrey", "Necaxa", "Pachuca",
        "Puebla", "Queretaro", "Santos Laguna", "Tigres", "Tijuana",
        "Toluca", "UNAM"
      ].sort()
    }
  ],
  Norway: [
    {
      name: "Eliteserien",
      code: "NOR",
      teams: [
        "Bodo/Glimt", "Brann", "Fredrikstad", "Ham-Kam", "Haugesund",
        "KFUM Oslo", "Kristiansund", "Lillestrom", "Molde", "Odd",
        "Rosenborg", "Sandefjord", "Sarpsborg 08", "Stromsgodset",
        "Tromso", "Viking"
      ].sort()
    }
  ],
  Poland: [
    {
      name: "Ekstraklasa",
      code: "POL",
      teams: [
        "Cracovia", "GKS Katowice", "Gornik Zabrze", "Jagiellonia",
        "Korona Kielce", "Lech Poznan", "Legia Warsaw", "Lechia Gdansk",
        "Motor Lublin", "Piast Gliwice", "Pogon Szczecin", "Puszcza",
        "Radomiak Radom", "Rakow", "Stal Mielec", "Slask Wroclaw",
        "Widzew Lodz", "Zaglebie Lubin"
      ].sort()
    }
  ],
  Romania: [
    {
      name: "Liga I",
      code: "ROU",
      teams: [
        "Botosani", "CFR Cluj", "Dinamo Bucharest", "Farul Constanta", "FCSB",
        "Gloria Buzau", "Hermannstadt", "Otelul", "Petrolul", "Poli Iasi",
        "Rapid Bucharest", "Sepsi Sf. Gheorghe", "Unirea Slobozia",
        "Universitatea Craiova", "U Cluj", "UTA Arad"
      ].sort()
    }
  ],
  Russia: [
    {
      name: "Premier League",
      code: "RUS",
      teams: [
        "Akhmat Grozny", "Akron Togliatti", "CSKA Moscow", "Dynamo Makhachkala",
        "Dynamo Moscow", "Fakel Voronezh", "Khimki", "Krasnodar",
        "Lokomotiv Moscow", "Nizhny Novgorod", "Orenburg", "Rostov",
        "Rubin Kazan", "Spartak Moscow", "Zenit St. Petersburg", "Krylya Sovetov"
      ].sort()
    }
  ],
  Sweden: [
    {
      name: "Allsvenskan",
      code: "SWE",
      teams: [
        "AIK", "BK Hacken", "Djurgarden", "GAIS", "Halmstad",
        "Hammarby", "IFK Goteborg", "IFK Norrkoping", "IFK Varnamo",
        "IK Sirius", "Kalmar FF", "Malmo FF", "Mjallby", "Vasteras SK",
        "Brommapojkarna", "Elfsborg"
      ].sort()
    }
  ],
  Switzerland: [
    {
      name: "Super League",
      code: "SUI",
      teams: [
        "Basel", "Grasshoppers", "Lugano", "Luzern", "Servette",
        "Sion", "St. Gallen", "Winterthur", "Young Boys", "Yverdon",
        "Zurich", "Lausanne"
      ].sort()
    }
  ],
  USA: [
    {
      name: "MLS",
      code: "USA", // In website it is often just USA
      teams: [
        "Atlanta United", "Austin FC", "Charlotte FC", "Chicago Fire",
        "FC Cincinnati", "Colorado Rapids", "Columbus Crew", "FC Dallas",
        "D.C. United", "Houston Dynamo", "Inter Miami CF", "LA Galaxy",
        "Los Angeles FC", "Minnesota United", "CF Montreal", "Nashville SC",
        "New England Revolution", "New York Red Bulls", "New York City FC",
        "Orlando City", "Philadelphia Union", "Portland Timbers",
        "Real Salt Lake", "San Jose Earthquakes", "Seattle Sounders",
        "Sporting Kansas City", "St. Louis City SC", "Toronto FC", "Vancouver Whitecaps"
      ].sort()
    }
  ]
};
