import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  HStack,
  Text,
  SegmentGroup,
  Slider
} from '@chakra-ui/react'
import { FaPlus, FaMinus } from 'react-icons/fa'

function Home() {
  const [players, setPlayers] = useState(['', '', '']) // 初期3人 
  const navigate = useNavigate()

const [minLevel, setMinLevel] = useState<number>(() => {
  const saved = localStorage.getItem('minLevel')
  const parsed = Number(saved)
  return isNaN(parsed) ? 1 : parsed
})

const [maxLevel, setMaxLevel] = useState<number>(() => {
  const saved = localStorage.getItem('maxLevel')
  const parsed = Number(saved)
  return isNaN(parsed) ? 5 : parsed
})
const marks = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
 
]
const handleLevelChange = (value: number,value2: number) => {
  setMinLevel(value)
  setMaxLevel(value2)
  localStorage.setItem('minLevel', String(value))
  localStorage.setItem('maxLevel', String(value2))
}

  const [withExplanation, setWithExplanation] = useState<string|null>(
  () => localStorage.getItem('withExplanation') ?? '解説あり'
)

  const saveExplanation = (withExplanation: string|null) => {
    setWithExplanation(withExplanation)
    localStorage.setItem('withExplanation', withExplanation || '解説あり')
  }
  const handleChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleAddPlayer = () => {
    setPlayers([...players, ''])
  }

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 3) return // 最低3人を保証
    const newPlayers = players.filter((_, i) => i !== index)
    setPlayers(newPlayers)
  }

  const handleStart = () => {
    const trimmed = players.map(p => p.trim())
    const hasDuplicates = new Set(trimmed).size !== trimmed.length
    if (hasDuplicates) {
      alert('プレイヤー名に重複があります。')
      return
    }
    if (trimmed.every(name => name !== '')) {
      localStorage.setItem('players', JSON.stringify(trimmed))
      navigate('/game')
    }
  }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="stretch" px={4} >
      <VStack>
        <Heading>エンジニアワードウルフ</Heading>
        {minLevel !== maxLevel && (
           <Text fontSize="md" mb={1}>出題レベル: {minLevel}~{maxLevel}</Text>
         )}
         {minLevel === maxLevel && (
           <Text fontSize="md" mb={1}>出題レベル: {minLevel}</Text>
         )}
       <Slider.Root width="150px"value={[minLevel, maxLevel]} step={1} min={1} max={5} 
       onValueChange={(e) => handleLevelChange(e.value[0], e.value[1])} 
       colorPalette="gray.500" size="sm">
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs  boxSize={4} borderColor="gray.500"/>
            <Slider.Marks marks={marks} />
          </Slider.Control>
        </Slider.Root>

    <SegmentGroup.Root value={withExplanation} onValueChange={(e) => saveExplanation(e.value)}>
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={["解説あり", "解説なし"]} />
    </SegmentGroup.Root>

        {players.map((name, idx) => (
          <HStack key={idx} w="100%">
            <Input
              placeholder={`プレイヤー${idx + 1}の名前`}
              value={name}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
            
          </HStack>
        ))}

        <HStack>
          <Button
            aria-label="プレイヤーを追加"
            onClick={handleAddPlayer}
            colorScheme="blue"
          >
            <FaPlus />
          </Button>

          {players.length > 3 && (
              <Button
                aria-label="プレイヤーを削除"
                onClick={() => handleRemovePlayer(players.length - 1)}
                colorScheme="red"
              >
                <FaMinus />
              </Button>
            )}
            
          <Button
            colorScheme="teal"
            onClick={handleStart}
            disabled={players.some(p => p.trim() === '')}
          >
            スタート
          </Button>
        </HStack>

        <Text fontSize="sm" color="gray.500">
          プレイヤー名をすべて入力してください（最低3人）
        </Text>
      </VStack>
    </Box>
  )
}

export default Home
