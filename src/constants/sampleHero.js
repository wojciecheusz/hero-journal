/**
 * Przykładowy bohater — John Silverblade, Paladyn poziom 5.
 * Wszystkie zakładki wypełnione min. 3 wpisami.
 * Notatki sesji zawierają imiona NPC i nazwy lokacji
 * — automatycznie stają się hiperłączami w widoku kroniki.
 */
export function createSampleHero() {
  const id = "sample_" + Date.now();

  /* ── KARTA POSTACI ─────────────────────────────── */
  const char = {
    name: "John Silverblade",
    classes: [{ name: "Paladyn", level: 5 }],
    stats: { STR: 18, DEX: 10, CON: 16, INT: 10, WIS: 12, CHA: 14 },
    profBonus: 3,
    hp: { current: 44, max: 52, temp: 0 },
    ac: 18,
    initiativeBonus: undefined,
    xp: 8500,
    savingThrows: { wis: true, cha: true },
    savingThrowExp: {}, savingThrowOverride: {},
    skills: { athletics: true, intimidation: true, perception: true, persuasion: true },
    skillExp: {},
    alignment: "Praworządny dobry",
    background: "Żołnierz",
    traits: {
      personality: "Zawsze dotrzymuję słowa. Moje słowo to moja broń, a moja broń nigdy nie kłamie.",
      ideals: "Sprawiedliwość musi przeważać. Nawet wróg zasługuje na uczciwy wyrok — ale nie na litość bez zasług.",
      bonds: "Przysięgałem bronić niewinnych przed mocami ciemności. Tej przysięgi nie złamię, cokolwiek się stanie.",
      flaws: "Działam pochopnie gdy widzę cierpiących. Nie pytam o cenę — po prostu uderzam.",
    },
    personalNotes: "Muszę znaleźć Świętą Relikwię zanim trafi głębiej w struktury kultu. Elara Moonwhisper mówiła o tunelach pod Starą Dzielnicą — sprawdzić to następnym razem w Baldur's Gate.",
    backstory: "John Silverblade wyrósł w małej wiosce na obrzeżach królestwa. Jako młody chłopak przeżył napad kultu demonów, który obrócił jego dom w zgliszcza. Ocalony przez wędrownego paladyna, przysiągł poświęcić życie walce ze złem. Po latach służby w Zakonie Srebrnego Płomienia wyruszył samotnie, by stawić czoła rosnącemu zagrożeniu ze strony Kultu Smoczej Krwi — organizacji, która skradła świętą relikwię Zakonu.",
    spellSlots: {
      "1. poziom": { max: 4, used: 2 },
      "2. poziom": { max: 2, used: 0 },
    },
    spellcastingAbility: "CHA",
    hitDice: { type: "d10", max: 5, used: 2 },
    deathSaves: { successes: 0, failures: 0 },
  };

  /* ── PLECAK ────────────────────────────────────── */
  const inventory = [
    {
      id: 101, name: "Długi miecz +1", type: "Broń", qty: "1",
      damage: "1d8", damageType: "Sieczne", modifier: "1",
      charges: "", effect: "",
      note: "Znaleziony w Jaskini Cieni. Lśni lekkim blaskiem w ciemności — znak dawnego zaklęcia uświęcenia.",
      equipped: true, tags: ["magiczna"],
    },
    {
      id: 102, name: "Zbroja płytowa", type: "Pancerz", qty: "1",
      damage: "", damageType: "", modifier: "", charges: "", effect: "",
      note: "Dobrze dopasowana. KP 18. Wypolerowana do połysku — znak Johna na polu walki.",
      equipped: true, tags: [],
    },
    {
      id: 103, name: "Tarcza heraldyczna", type: "Pancerz", qty: "1",
      damage: "", damageType: "", modifier: "", charges: "", effect: "",
      note: "Na tarczy symbol Zakonu Srebrnego Płomienia — srebrny płomień na czarnym tle.",
      equipped: true, tags: ["zakon"],
    },
    {
      id: 104, name: "Mikstura Leczenia", type: "Jednorazowy", qty: "3",
      damage: "", damageType: "", modifier: "",
      charges: "3", effect: "Przywraca 2k4+2 PŻ",
      note: "Zakupione w Świątyni Mystryl od Elary Moonwhisper.",
      equipped: false, tags: ["lekarstwo"],
    },
    {
      id: 105, name: "Zwój — Wykryj Zło i Dobro", type: "Zwój z czarem", qty: "1",
      damage: "", damageType: "", modifier: "",
      charges: "1", effect: "Detect Evil and Good, zasięg 30 stóp, czas 10 min.",
      note: "Podarowany przez Elarę przed wyprawą do Jaskini Cieni.",
      equipped: false, tags: ["magia", "zwiady"],
    },
    {
      id: 106, name: "Lina jedwabna 15 m", type: "Narzędzie", qty: "1",
      damage: "", damageType: "", modifier: "", charges: "", effect: "",
      note: "Niezbędna przy eksploracji podziemi. Kilka razy uratowała życie.",
      equipped: false, tags: [],
    },
  ];

  /* ── CZARY ─────────────────────────────────────── */
  const spells = [
    {
      id: 201, name: "Leczenie Ran", level: "1. poziom", school: "Przywoływanie",
      castingTime: "1 akcja", zakres: "Dotyk", duration: "Natychmiastowy",
      components: "V, S",
      description: "Stworzenie, którego dotkniesz, odzyskuje liczbę PŻ równą 1k8 + twój modyfikator rzucania czarów (CHA). Nie działa na nieumarłych ani konstrukty.",
      notes: "Na wyższym slocie: +1k8 za każdy poziom powyżej 1.",
      tags: ["uzdrawianie"], pinned: false, inUse: true,
    },
    {
      id: 202, name: "Boska Smite", level: "1. poziom", school: "Wywoływanie",
      castingTime: "1 akcja bonusowa", zakres: "Ja", duration: "Koncentracja, do 1 minuty",
      components: "V",
      description: "Następne uderzenie bronią zadaje dodatkowe 2k8 obrażeń od promieniowania. Wobec nieumarłych i ożywionych stworzeń — 3k8.",
      notes: "Na wyższym slocie: +1k8 za każdy poziom powyżej 1.",
      tags: ["obrażenia", "walka"], pinned: false, inUse: true,
    },
    {
      id: 203, name: "Ochrona przed Złem i Dobrem", level: "1. poziom", school: "Odrzucanie",
      castingTime: "1 akcja", zakres: "Dotyk", duration: "Koncentracja, do 10 minut",
      components: "V, S, M (woda święcona)",
      description: "Jedno chętne stworzenie jest chronione przed aberracjami, niebiańskimi, demonami, nieumarłymi i wróżkami. Ataki tych stworzeń są wykonywane ze stratą na kości.",
      notes: "",
      tags: ["ochrona"], pinned: false, inUse: true,
    },
    {
      id: 204, name: "Rozkaz", level: "1. poziom", school: "Surogacja",
      castingTime: "1 akcja", zakres: "60 stóp", duration: "1 runda",
      components: "V",
      description: "Wypowiadasz jedno słowo rozkazu do stworzenia, które możesz zobaczyć. Cel musi wykonać rzut obronny na MĄD. Przy porażce wykonuje rozkaz (np. Uciekaj!, Padnij!, Podejdź!, Zatrzymaj się!).",
      notes: "Skuteczny do rozdzielenia wrogów lub zatrzymania ucieczki.",
      tags: ["kontrola", "surogacja"], pinned: false, inUse: false,
    },
  ];

  /* ── ZDOLNOŚCI ─────────────────────────────────── */
  const skills = [
    {
      id: 301, name: "Drugie Uderzenie", category: "Umiejętność",
      description: "Gdy atakujesz akcją Ataku, możesz wykonać jeden dodatkowy atak bronią jako akcję bonusową w tej samej turze.",
      level: 3, tags: ["walka", "akcja-bonusowa"], pinned: false, inUse: true,
    },
    {
      id: 302, name: "Nałożenie Rąk", category: "Cecha rasowa",
      description: "Masz pulę 25 PŻ na dzień. Jako akcję dotykasz stworzenia i przywracasz mu dowolną ilość PŻ z tej puli. Alternatywnie za 5 PŻ leczysz jedno zatrucie lub chorobę.",
      level: 2, tags: ["uzdrawianie", "paladyn"], pinned: false, inUse: true,
    },
    {
      id: 303, name: "Boski Zmysł", category: "Cecha rasowa",
      description: "Jako akcję otwierasz świadomość na wyższe moce. Do końca następnej tury znasz lokalizację każdego nieumarłego, demona lub niebiańskiego w promieniu 60 stóp — nawet za ścianami.",
      level: 1, tags: ["wykrywanie", "paladyn"], pinned: false, inUse: false,
    },
    {
      id: 304, name: "Aura Odwagi", category: "Atut",
      description: "Przyjacielskie stworzenia w promieniu 10 stóp od ciebie nie mogą być przestraszone, gdy jesteś przytomny. (Dostępna od 10. poziomu — cel Johna)",
      level: 0, tags: ["aura", "cel"], pinned: false, inUse: false,
    },
  ];

  /* ── NPC ───────────────────────────────────────── */
  const npcs = [
    {
      id: 401, name: "Elara Moonwhisper", role: "Kapłanka Mystryl",
      relation: "ally", affiliation: "Świątynia Mystryl",
      metAt: "Baldur's Gate — Tawerna Pod Złotą Podkową",
      connections: "Informatorka, sojuszniczka, dostawczyni mikstur",
      notes: "Elfka o srebrnych włosach i przenikliwych, fioletowych oczach. Posiada rozległą wiedzę o kulcie — studiuje ich rytuały od lat. Można jej ufać bezwarunkowo. Aktualnie przebywa w Świątyni Mystryl w Baldur's Gate. Wspomniała o tunelach pod Starą Dzielnicą.",
      tags: ["kapłanka", "elf", "sojusznik"], pinned: true,
    },
    {
      id: 402, name: "Mrak Thornwood", role: "Mroczny Rycerz Kultu",
      relation: "hostile", affiliation: "Kult Smoczej Krwi",
      metAt: "Jaskinia Cieni",
      connections: "Lokalny lider kultu, poszukiwany przez Straż",
      notes: "Wysoki mężczyzna w czarnej zbroi z symbolem demonicy. Pokonany w Jaskini Cieni, ale zdołał uciec przez ukryte wyjście. Prawdopodobnie szuka zemsty. NIEBEZPIECZNY — walczy bez honoru.",
      tags: ["kult", "wróg", "poszukiwany"], pinned: false,
    },
    {
      id: 403, name: "Barlin Gędźbor", role: "Karczmarz",
      relation: "neutral", affiliation: "Tawerna Pod Złotą Podkową",
      metAt: "Baldur's Gate — Tawerna Pod Złotą Podkową",
      connections: "Źródło plotek, skrzynka meldunek",
      notes: "Gruby krasnolud z siwą, zaplecioną brodą. Sympatyczny, dyskretny — za odpowiednią monetę dzieli się informacjami o podróżnikach. Nienawidzi kłopotów. Zna każdego w mieście.",
      tags: ["karczmarz", "krasnolud", "informator"], pinned: false,
    },
    {
      id: 404, name: "Ser Aldric Vance", role: "Dowódca Gwardii Wschodniej",
      relation: "ally", affiliation: "Straż Miejska Baldur's Gate",
      metAt: "Brama Wschodnia, Baldur's Gate",
      connections: "Oficjalne wsparcie w mieście, wydaje przepustki",
      notes: "Starszy rycerz o zmęczonym, ale szlachetnym spojrzeniu. Pomógł podczas wejścia do miasta. Wierzy, że kult wciąż działa w podziemiu. Straż jest przeciążona i nie może działać poza murami.",
      tags: ["rycerz", "straż", "oficjalny"], pinned: false,
    },
  ];

  /* ── LOKACJE ───────────────────────────────────── */
  const locations = [
    {
      id: 501, name: "Baldur's Gate", type: "Osada",
      notes: "Wielkie miasto portowe — tętniące życiem targowisko i polityczne centrum regionu. Tutaj działa Świątynia Mystryl, Gildia Kupiecka i Straż Miejska. W podziemiu Starej Dzielnicy podobno operuje Kult Smoczej Krwi. Bezpieczne miejsce do odpoczynku.",
      tags: ["miasto", "port", "baza"], pinned: false,
    },
    {
      id: 502, name: "Jaskinia Cieni", type: "Podziemia",
      notes: "Mroczna jaskinia 3 dni drogi na wschód od Baldur's Gate, ukryta za wodospadem w lesie Cloak Wood. Była bazą kultu. Po wyprawie sesji 3 znaleziono tu Długi miecz +1 i Zwój — Wykryj Zło i Dobro. Mrak Thornwood uciekł przez tajne wyjście na wschodzie.",
      tags: ["jaskinia", "kult", "eksploracja"], pinned: true,
    },
    {
      id: 503, name: "Tawerna Pod Złotą Podkową", type: "Budynek",
      notes: "Przytulna tawerna w centrum Baldur's Gate, prowadzona przez Barlina Gędźbora. Dobre jedzenie, tanie noclegi — 5 sz/noc. Stałe miejsce spotkań. Barlin zawsze wie co słychać w mieście.",
      tags: ["tawerna", "baza", "odpoczynek"], pinned: false,
    },
    {
      id: 504, name: "Świątynia Mystryl", type: "Budynek",
      notes: "Wielka świątynia w zachodniej dzielnicy Baldur's Gate — biało-złota architektura, zawsze otwarta dla wiernych. Siedziba Elary Moonwhisper. Bezpieczne miejsce, duża biblioteka z informacjami o kulcie. Można tu kupić miksturki i zwoje.",
      tags: ["świątynia", "bezpieczna", "zakupy"], pinned: false,
    },
  ];

  /* ── SESJE ─────────────────────────────────────── */
  const sessions = [
    {
      id: 601, number: 1,
      date: "2025-03-15",
      title: "Przybycie do Baldur's Gate",
      notes: "John Silverblade przybył do Baldur's Gate po tygodniowej podróży z północy. W Tawernie Pod Złotą Podkową spotkał Elara Moonwhisper — elfkę kapłankę, która ostrzegła go przed wzmożoną aktywnością Kultu Smoczej Krwi w okolicach miasta. Barlin Gędźbor przy piwie opowiedział o znikającym towarze z magazynów portowych oraz o grupie nieznajomych w czarnych płaszczach, którzy zatrzymali się tu trzy noce temu.",
    },
    {
      id: 602, number: 2,
      date: "2025-03-22",
      title: "Napad na karawanę",
      notes: "Drużyna przyjęła zlecenie ochrony karawany Gildii Kupieckiej. W połowie drogi między Baldur's Gate a Wrotami Lasu kultyści zaatakowali z lasu. John Silverblade powstrzymał Mraka Thornwooda od ucieczki z cennym pergaminem — listą agentów kultu w mieście. Elara Moonwhisper zidentyfikowała symbol na ich zbrojach jako znak Kultu Smoczej Krwi. Ser Aldric Vance po naszym raporcie nakazał wzmocnić patrole przy Bramie Wschodniej.",
    },
    {
      id: 603, number: 3,
      date: "2025-04-05",
      title: "Szturm na Jaskinię Cieni",
      notes: "Na podstawie mapy zdobytej od Mraka dotarliśmy do Jaskini Cieni. John przeprowadził drużynę przez pułapki przy wejściu. Pokonaliśmy strażników kultu i dotarliśmy do głównej komnaty — zastaliśmy tu ołtarz i skrzytkę ze zwojami. Mrak Thornwood zdołał uciec przez ukryte wyjście na wschodzie. Zdobyliśmy Długi miecz +1 i Zwój — Wykryj Zło i Dobro. Elara Moonwhisper stwierdziła, że relikwia Zakonu nie była tu przechowywana — szukamy dalej.",
    },
  ];

  /* ── ZADANIA ───────────────────────────────────── */
  const quests = [
    {
      id: 701,
      name: "Odzysk Świętej Relikwii",
      description: "Kult Smoczej Krwi skradł relikwię Zakonu. Kopia znaleziona w Jaskini Cieni wskazuje, że oryginał jest głębiej w strukturach kultu.",
      reward: "Błogosławieństwo Zakonu + 5000 sz złota",
      status: "Aktywne",
      kroks: [
        { id: 7011, text: "Dotrzeć do Jaskini Cieni", done: true },
        { id: 7012, text: "Pokonać straże kultu", done: true },
        { id: 7013, text: "Odnaleźć mapę głównej kwatery kultu", done: false },
        { id: 7014, text: "Odzyskać relikwię z rąk kultu", done: false },
      ],
    },
    {
      id: 702,
      name: "Schwytać Mraka Thornwooda",
      description: "Mroczny Rycerz kultu uciekł podczas szturmu na Jaskinię Cieni. Musi zostać schwytany, zanim ostrzeże główną kwaterę.",
      reward: "Informacje o strukturze kultu + 1000 sz złota od Straży",
      status: "Aktywne",
      kroks: [
        { id: 7021, text: "Dowiedzieć się przez Barlina gdzie kryją się kultysci", done: false },
        { id: 7022, text: "Wyśledzić Mraka Thornwooda", done: false },
        { id: 7023, text: "Schwytać lub zneutralizować Mraka", done: false },
      ],
    },
    {
      id: 703,
      name: "Oczyść Jaskinię Cieni",
      description: "Pokonaliśmy kultystów w jaskini, ale mogli być ocalali. Okoliczni chłopi proszą o pomoc.",
      reward: "500 sz złota od okolicznych wsi",
      status: "Ukończone",
      kroks: [
        { id: 7031, text: "Wejść do jaskini", done: true },
        { id: 7032, text: "Pokonać wszystkich kultystów", done: true },
        { id: 7033, text: "Sprawdzić wszystkie komnaty i oczyszcić ołtarz", done: true },
      ],
    },
    {
      id: 704,
      name: "Ochrona karawany Gildii",
      description: "Zadanie zlecone przez Gildię Kupiecką — bezpieczny transport ładunku na wschód.",
      reward: "300 sz złota + dobre relacje z Gildią Kupiecką",
      status: "Ukończone",
      kroks: [],
    },
  ];

  /* ── FRAKCJE ───────────────────────────────────── */
  const factions = [
    {
      id: 801,
      name: "Zakon Srebrnego Płomienia",
      type: "Zakon",
      rank: "Członek",
      leader: "Arcykapłan Dorian Ashford",
      headquarters: "Cytadela Płomienia, Waterdeep",
      goal: "Zwalczanie sił zła, ochrona niewinnych przed demonami i kultami",
      notes: "John jest pełnoprawnym członkiem Zakonu od 3 lat. Działa jako wysłannik w terenie — pełna autonomia decyzji. Zakon ma szeroką sieć kontaktów i agentów w wielu miastach. Wszelka pomoc przy relikwii jest najwyższym priorytetem.",
      reputation: 75, tags: ["zakon", "sojusznik", "zleceniodawca"], pinned: true,
    },
    {
      id: 802,
      name: "Kult Smoczej Krwi",
      type: "Kult",
      rank: "Wróg",
      leader: "Nieznany Arcykultyta (pseudonim: Czerwony Cień)",
      headquarters: "Nieznana — prawdopodobnie pod Starą Dzielnicą Baldur's Gate",
      goal: "Przywołanie starożytnego demona przy użyciu świętych artefaktów zakonnych",
      notes: "Kult działa głęboko w podziemiu. Mają agentów w strukturach miasta. Mrak Thornwood jest jednym z rycerzy-dowódców. Symbol: czerwony smok na czarnym tle. Nie zawahają się przed morderstwem. Finansowani przez nieznanego możnowładcę.",
      reputation: -90, tags: ["kult", "wróg", "demony", "zagrożenie"], pinned: false,
    },
    {
      id: 803,
      name: "Gildia Kupiecka Baldur's Gate",
      type: "Kupcy",
      rank: "Sojusznik",
      leader: "Mistrz Handlu Renwick Thorn",
      headquarters: "Dom Gildii, Zachodnia Dzielnica, Baldur's Gate",
      goal: "Bezpieczeństwo szlaków handlowych i ochrona interesów kupieckich",
      notes: "Współpraca nawiązana po udanej ochronie karawany. Dobrze płacą za zlecenia. Mają rozległą sieć informatorów — wiedzą o podejrzanym ruchu towarów w regionie. Potencjalne źródło informacji o przemycie kultu.",
      reputation: 40, tags: ["kupcy", "zleceniodawca", "informacje"], pinned: false,
    },
    {
      id: 804,
      name: "Straż Miejska Baldur's Gate",
      type: "Rząd",
      rank: "Sojusznik",
      leader: "Komendant Helena Vance",
      headquarters: "Twierdza Straży, Brama Wschodnia, Baldur's Gate",
      goal: "Utrzymanie porządku publicznego i ochrona granic miasta",
      notes: "Ser Aldric Vance jest naszym kontaktem. Straż jest przytłoczona pracą. Oficjalnie nas wspiera, ale nie może działać poza murami bez rozkazu Rady. Wzmocnili patrole po naszym raporcie o kulcie.",
      reputation: 30, tags: ["straż", "miasto", "oficjalny"], pinned: false,
    },
  ];

  const profile = {
    id,
    name: "John Silverblade",
    class: "Paladyn",
    level: 5,
    created: Date.now(),
  };

  return { id, profile, char, inventory, npcs, locations, skills, spells, sessions, quests, factions };
}
