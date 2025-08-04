import { useEffect, useState,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Text,
  Button,
  VStack,
  Heading,
  Spinner
} from '@chakra-ui/react'

function getRandomIntInRange(min: number, max: number): number {
  // min以上 max以下 の整数を返す
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function buildWordQueryUrl(categoryId: number, minLevel: number, maxLevel: number): string {
  const baseUrl = "https://api.it-word-wolf.nrysk.dev/words/random";

  const level = getRandomIntInRange(minLevel, maxLevel);
  const params = new URLSearchParams({
    category_id: categoryId.toString(),
    difficulty_level: level.toString()
  });

  return `${baseUrl}?${params.toString()}`;
}

function Game() {

  const didFetch = useRef(false)
  const [players, setPlayers] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [step, setStep] = useState<'loading' | 'confirmName' | 'showWord' | 'done'>('loading')
  const [wordMap, setWordMap] = useState<Record<string, string>>({})
  const withExplanation = localStorage.getItem('withExplanation') || '解説あり'
  const navigate = useNavigate()
  const [citizenExplanation, setCitizenExplanation] = useState<string>('市民のお題の解説がありません')
  const [werewlofExplanation, setWerewlofExplanation] = useState<string>('ウルフのお題の解説がありません')
  const [citizenWord, setCitizenWord] = useState<string>('市民のお題がありません')
  const [citizenNumber] = useState<number>(() => getRandomIntInRange(0, 3));
  const [werewlofNumber, setWerewlofNumber] = useState<number>(0);

useEffect(() => {
  const newWerewolf = (citizenNumber + getRandomIntInRange(1, 3)) % 4;
  setWerewlofNumber(newWerewolf);
}, [citizenNumber]);
  const [minLevel] = useState<number>(() => {
    const saved = localStorage.getItem('minLevel')
    const parsed = Number(saved)
    return isNaN(parsed) ? 1 : parsed
  })
  const [maxLevel] = useState<number>(() => {
    const saved = localStorage.getItem('maxLevel')
    const parsed = Number(saved)
    return isNaN(parsed) ? 5 : parsed
  })
  type Category = {
  id: number;
  name: string;
};
  const categories = useState<Category[]>(() => {
    const saved = localStorage.getItem('selectedDomains')
    if (saved) {
      return JSON.parse(saved)
    }
    return []
  })[0]

  const randomDomain = categories[Math.floor(Math.random() * categories.length)];

  

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    // プレイヤー取得
    const data = localStorage.getItem('players')
    const url = buildWordQueryUrl(randomDomain.id, minLevel, maxLevel)
    if (!data) {
      navigate('/')
      return
    }

    const playerList = JSON.parse(data) as string[]

    // minLevelとmaxLevelを送信しお題をサーバから取得
fetch(url, {
  method: 'GET',

})

  .then(res => res.json())
  .then(json => {

    const citizen =  json.words[citizenNumber].word
    const werewlof = json.words[werewlofNumber].word
    const domain = json.category
    const level = json.difficulty
    setCitizenExplanation(json.words[citizenNumber].explanation || '市民のお題の解説がありません')
    setWerewlofExplanation(json.words[werewlofNumber].explanation || 'ウルフのお題の解説がありません')
    setCitizenWord(citizen)
    console.log('json', json)

    localStorage.setItem('themeData', JSON.stringify({
  citizen: {
    word: citizen,
    explanation: json.words[citizenNumber].explanation || '市民のお題の解説がありません'
  },
  werewlof: {
    word: werewlof,
    explanation: json.words[werewlofNumber].explanation || 'ウルフのお題の解説がありません'
  },
  level: level,
  domain: domain
}))

    // ランダムに1人をウルフに設定
    const wlofIndex = Math.floor(Math.random() * playerList.length)
    const wordAssignments: Record<string, string> = {}

    playerList.forEach((player, i) => {
      wordAssignments[player] = i === wlofIndex ? werewlof : citizen
    })

    setWordMap(wordAssignments)
    setPlayers(playerList)
    setStep('confirmName')
  })
  }, [])

  const currentPlayer = players[currentIndex]
  const currentWord = wordMap[currentPlayer]


  const handleNext = () => {
    if (currentIndex + 1 < players.length) {
      setCurrentIndex((prev) => prev + 1)
      setStep('confirmName')
    } else {
      setStep('done')
    }
  }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="center" px={4}>
      <VStack>
        

        {step === 'loading' &&
      <>
            <Heading>お題生成中...</Heading>
            <Spinner size="xl" />
          </>}

        {step === 'confirmName' && (
          <>
            <Heading>お題確認</Heading> 
            <Text fontSize="xl">{currentPlayer}さんですか？</Text>
            <Button colorScheme="blue" onClick={() => setStep('showWord')}>
              はい
            </Button>
          </>
        )}

        {step === 'showWord' && (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              お題：{currentWord}
            </Text>
           
            {withExplanation === '解説あり' && (
              <>
                <Box p={4} borderWidth="1px" borderRadius="lg" w="300px">
                  <Text fontWeight="bold">解説:</Text>
                  <Text fontSize="sm" color="gray.600">
                    
                    {currentWord === citizenWord ? citizenExplanation : werewlofExplanation}
                  </Text>
                 
                </Box>
              </>
            )}
           
            <Button colorScheme="green" onClick={handleNext}>
              確認しました
            </Button>
          </>
        )}

        {step === 'done' && (
          <>
            <Text fontSize="xl">全員の確認が終わりました！</Text>
            <Button colorScheme="teal" onClick={() => navigate('/play')}>
              ゲーム開始！
            </Button>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default Game