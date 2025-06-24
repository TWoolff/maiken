import { TextContentEntry, RichTextDocument, HyperlinkNode } from '@/types/types';
import css from './content.module.css';

interface TextContentProps {
	content: TextContentEntry;
	language: string;
}

const TextContent = ({ content, language }: TextContentProps) => {
	const textAlign = content.fields.textAlign?.['en-US'] ?? true;

	// Helper function to render text with line breaks
	const renderTextWithLineBreaks = (text: string) => {
		const lines = text.split('\n');
		return lines.map((line, index) => (
			<span key={index}>
				{line}
				{index < lines.length - 1 && <br />}
			</span>
		));
	};

	// Helper function to render a text node with formatting
	const renderTextNode = (textNode: any, tIndex: number) => {
		const text = textNode.value;
		const isBold = textNode.marks?.some((mark: any) => mark.type === 'bold');
		const isItalic = textNode.marks?.some((mark: any) => mark.type === 'italic');
		const isUnderline = textNode.marks?.some((mark: any) => mark.type === 'underline');

		return (
			<span
				key={tIndex}
				style={{
					fontWeight: isBold ? 'bold' : 'normal',
					fontStyle: isItalic ? 'italic' : 'normal',
					textDecoration: isUnderline ? 'underline' : 'none',
				}}
			>
				{renderTextWithLineBreaks(text)}
			</span>
		);
	};

	return (
		<article className={`${css.textContainer} space`} style={{ textAlign: textAlign ? 'left' : 'right' }}>
			{content.fields.text[language]?.content.map((node: RichTextDocument['content'][0], i: number) => {
				switch (node.nodeType) {
					case 'heading-1':
						return <h1 key={i}>{node.content.map((textNode, tIndex) => renderTextNode(textNode, tIndex))}</h1>;
					case 'heading-2':
						return <h2 key={i}>{node.content.map((textNode, tIndex) => renderTextNode(textNode, tIndex))}</h2>;
					case 'heading-3':
						return <h3 key={i}>{node.content.map((textNode, tIndex) => renderTextNode(textNode, tIndex))}</h3>;
					case 'paragraph':
						return (
							<p key={i}>
								{node.content.map((textNode, tIndex) => {
									// Handle hyperlinks
									if (textNode.nodeType === 'hyperlink' && 'data' in textNode && 'content' in textNode) {
										const hyperlinkNode = textNode as HyperlinkNode;
										return (
											<a key={tIndex} href={hyperlinkNode.data.uri} target='_blank' rel='noopener noreferrer'>
												{hyperlinkNode.content.map((linkText, linkIndex) => renderTextNode(linkText, linkIndex))}
											</a>
										);
									}

									// Handle regular text nodes
									return renderTextNode(textNode, tIndex);
								})}
							</p>
						);
					default:
						// Default case for paragraphs and other node types
						return (
							<p key={i}>
								{node.content.map((textNode, tIndex) => {
									// Handle hyperlinks
									if (textNode.nodeType === 'hyperlink' && 'data' in textNode && 'content' in textNode) {
										const hyperlinkNode = textNode as HyperlinkNode;
										return (
											<a key={tIndex} href={hyperlinkNode.data.uri} target='_blank' rel='noopener noreferrer'>
												{hyperlinkNode.content.map((linkText, linkIndex) => renderTextNode(linkText, linkIndex))}
											</a>
										);
									}

									// Handle regular text nodes
									return renderTextNode(textNode, tIndex);
								})}
							</p>
						);
				}
			})}
		</article>
	);
};

export default TextContent;
