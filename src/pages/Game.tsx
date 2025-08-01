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
  const domain = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedDomains')
    if (saved) {
      return JSON.parse(saved)
    }
    return ["AI", "Web", "ソフトウェア工学", "プログラミング言語", "データ構造とアルゴリズム", "セキュリティ", "データベース", "ネットワーク", "組み込み"]
  })[0]

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    // プレイヤー取得
    const data = localStorage.getItem('players')
    if (!data) {
      navigate('/')
      return
    }

    const playerList = JSON.parse(data) as string[]

    // minLevelとmaxLevelを送信しお題をサーバから取得
fetch('http://localhost:8012/generate-word-pair', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    minLevel,
    maxLevel,
    domain
  })
})
  .then(res => res.json())
  .then(json => {
    const citizen = json.citizen
    const werewlof = json.werewlof
    const level = json.level
    const domain = json.domain
    setCitizenExplanation(json['citizen-explanation'] || '市民のお題の解説がありません')
    setWerewlofExplanation(json['werewlof-explanation'] || 'ウルフのお題の解説がありません')
    setCitizenWord(citizen)

    localStorage.setItem('themeData', JSON.stringify({
  citizen: {
    word: citizen,
    explanation: json['citizen-explanation']
  },
  werewlof: {
    word: werewlof,
    explanation: json['werewlof-explanation']
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