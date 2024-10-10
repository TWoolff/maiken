// Contact.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/services/context';
import { getPage } from '@/services/contentful';
import { getLocalizedField } from '@/utils/localization';
import css from './contact.module.css';

const Contact: React.FC = () => {
  const { state } = useAppContext();
  const [contactData, setContactData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const language = state.language === 'da' ? 'da-DK' : 'en-US';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const page = await getPage('contact');
        if (page && page.items && page.items.length > 0) {
          setContactData(page.items[0]);
        }
      } catch (err) {
        setError('Error fetching contact page data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return null;
  if (!contactData) return null;

  const title: string = getLocalizedField(contactData.fields?.title, language) as string;
  const contentArray = contactData.fields?.content?.['en-US'] || [];

  return (
    <section className={`${css.contact} grid space`}>
      <h1>{title}</h1>
      {contentArray.length > 0 ? (
        contentArray.map((entry: any, i: number) => {
          if (entry.fields?.text) {
            const textContent: { content: { content: { value: string }[] }[] } | null = getLocalizedField(entry.fields.text, language);
            return (
              <div className={css.content} key={i}>
                {textContent?.content.map((paragraph: any, i: number) => (
                  <p key={i}>
                    {paragraph.content.map((textNode: any) => textNode.value).join(' ')}
                  </p>
                ))}
              </div>
            );
          }
          return null;
        })
      ) : null }
    </section>
  );
};

export default Contact;
