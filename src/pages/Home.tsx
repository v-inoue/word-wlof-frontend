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
  Slider,
  Accordion,
  Checkbox,
  For
} from '@chakra-ui/react'
import { FaPlus, FaMinus } from 'react-icons/fa'

function Home() {
  const [players, setPlayers] = useState(['', '', '']) // 初期3人 
  const navigate = useNavigate()

  const [minLevel, setMinLevel] = useState<number>(1)
  const [maxLevel, setMaxLevel] = useState<number>(5)
  const marks = [
    { value: 1, label: "入門" },
    { value: 2, label: "初級" },
    { value: 3, label: "中級" },
    { value: 4, label: "上級" },
    { value: 5, label: "超上級" },
  ]
  const handleLevelChange = (value: number, value2: number) => {
    setMinLevel(value)
    setMaxLevel(value2)
    localStorage.setItem('minLevel', String(value))
    localStorage.setItem('maxLevel', String(value2))
  }

  const [withExplanation, setWithExplanation] = useState<string | null>(
    () => localStorage.getItem('withExplanation') ?? '解説あり'
  )
  type Category = {
  id: number;
  name: string;
};

  const categories: Category[] = [
  { id: 1, name: "プログラミング言語" },
  { id: 2, name: "データ構造とアルゴリズム" },
  { id: 3, name: "ネットワーク" },
  { id: 4, name: "データベース" },
  { id: 5, name: "セキュリティ" },
  { id: 6, name: "ソフトウェア工学" },
  { id: 7, name: "ヒューマンインターフェース" },
  { id: 8, name: "組み込みシステム" },
  { id: 9, name: "データサイエンス" },
  { id: 10, name: "コンピュータシステム" },
];
  const [selectedDomains, setSelectedDomains] = useState(categories)

  const toggleDomain = (domain: Category) => {
  const updated = selectedDomains.some(d => d.id === domain.id)
    ? selectedDomains.filter(d => d.id !== domain.id)
    : [...selectedDomains, domain]

  setSelectedDomains(updated)
  localStorage.setItem('selectedDomains', JSON.stringify(updated))
}

  const saveExplanation = (withExplanation: string | null) => {
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
    if (selectedDomains.length === 0) {
      alert('分野を1つ以上選択してください。')
      return
    }
    if (hasDuplicates) {
      alert('プレイヤー名に重複があります。')
      return
    }
    if (trimmed.every(name => name !== '')) {
      localStorage.setItem('players', JSON.stringify(trimmed))
      localStorage.setItem('selectedDomains', JSON.stringify(selectedDomains))
      localStorage.setItem('minLevel', String(minLevel))
      localStorage.setItem('maxLevel', String(maxLevel))
      localStorage.setItem('withExplanation', withExplanation || '解説あり')
      navigate('/game')
    }
  }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="stretch" px={4}>
      <VStack>
        <Heading>エンジニアワードウルフ</Heading>
        {minLevel !== maxLevel ? (
          <Text fontSize="md" mb={1}>出題レベル: {marks[minLevel - 1].label} ~ {marks[maxLevel - 1].label}</Text>
        ) : (
          <Text fontSize="md" mb={1}>出題レベル: {marks[minLevel - 1].label}</Text>
        )}
        <Slider.Root
          width="200px"
          value={[minLevel, maxLevel]}
          step={1}
          min={1}
          max={5}
          onValueChange={(e) => handleLevelChange(e.value[0], e.value[1])}
          colorPalette="gray"
          size="sm"
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs boxSize={4} borderColor="gray.500" />
            <Slider.Marks marks={marks} style={{ whiteSpace: 'nowrap' }} />
          </Slider.Control>
        </Slider.Root>
        
        <Accordion.Root collapsible size="sm">
          <Accordion.Item value="domain">
            <h2>
              <Accordion.ItemTrigger>
                分野を選択
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
            </h2>
            <Accordion.ItemContent>
              <VStack align="start">
                <For each={categories}>
                  {(category) => (
                    <Checkbox.Root
                      key={category.id}
                      defaultChecked
                      mt="2"
                      value={category.name}
                      onCheckedChange={() => toggleDomain(category)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{category.name}</Checkbox.Label>
                    </Checkbox.Root>
                  )}
                </For>
              </VStack>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
        
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
