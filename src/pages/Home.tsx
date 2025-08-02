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
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
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

  const domainList = ["AI", "Web", "ソフトウェア工学","プログラミング言語","データ構造とアルゴリズム","セキュリティ", "データベース", "ネットワーク","組み込み"]
  const [selectedDomains, setSelectedDomains] = useState(domainList)

  const toggleDomain = (domain: string) => {
  const updated = selectedDomains.includes(domain)
    ? selectedDomains.filter(d => d !== domain)
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
          <Text fontSize="md" mb={1}>出題レベル: {minLevel}~{maxLevel}</Text>
        ) : (
          <Text fontSize="md" mb={1}>出題レベル: {minLevel}</Text>
        )}
        <Slider.Root
          width="150px"
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
            <Slider.Marks marks={marks} />
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
                <For each={domainList}>
                  {(domain) => (
                    <Checkbox.Root
                      key={domain}
                      defaultChecked
                      mt="2"
                      value={domain}
                      onCheckedChange={() => toggleDomain(domain)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{domain}</Checkbox.Label>
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
