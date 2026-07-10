import React from 'react';
import { Heading, Text, Link, ListItem, UnorderedList, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

/** Render inline markdown: **bold**, *italic*, [text](href). */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      nodes.push(
        <Text as="strong" key={`${keyPrefix}-b-${i}`} fontWeight="700" color="ocean.700">
          {match[2]}
        </Text>
      );
    } else if (match[4]) {
      nodes.push(
        <Text as="em" key={`${keyPrefix}-i-${i}`}>
          {match[4]}
        </Text>
      );
    } else if (match[6]) {
      const href = match[7];
      const isInternal = href.startsWith('/');
      nodes.push(
        <Link
          key={`${keyPrefix}-a-${i}`}
          as={isInternal ? RouterLink : undefined}
          to={isInternal ? href : undefined}
          href={isInternal ? undefined : href}
          isExternal={!isInternal}
          color="brand.500"
          fontWeight="600"
          textDecoration="underline"
          textUnderlineOffset="3px"
          _hover={{ color: 'brand.600' }}
        >
          {match[6]}
        </Link>
      );
    }
    lastIndex = regex.lastIndex;
    i++;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

interface MarkdownProps {
  content: string;
}

/** Small, dependency-free markdown renderer for our blog posts. */
export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length === 0) return;
    const items = [...list];
    blocks.push(
      <UnorderedList key={`ul-${key++}`} spacing={2} pl={4} color="gray.700">
        {items.map((item, idx) => (
          <ListItem key={idx} lineHeight={1.8}>
            {renderInline(item, `li-${key}-${idx}`)}
          </ListItem>
        ))}
      </UnorderedList>
    );
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.startsWith('### ')) {
      flushList();
      blocks.push(
        <Heading key={`h3-${key++}`} as="h3" size="md" fontFamily="heading" color="ocean.600" pt={4}>
          {renderInline(line.slice(4), `h3-${key}`)}
        </Heading>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <Heading key={`h2-${key++}`} as="h2" size="lg" fontFamily="heading" color="ocean.700" pt={6}>
          {renderInline(line.slice(3), `h2-${key}`)}
        </Heading>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      list.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      blocks.push(
        <Text key={`p-${key++}`} fontSize="lg" lineHeight={1.9} color="gray.700">
          {renderInline(line, `p-${key}`)}
        </Text>
      );
    }
  }
  flushList();

  return <Box>{blocks.reduce<React.ReactNode[]>((acc, block, i) => {
    acc.push(<Box key={i} mb={4}>{block}</Box>);
    return acc;
  }, [])}</Box>;
};
