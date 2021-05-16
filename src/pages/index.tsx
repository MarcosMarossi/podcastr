import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ptBR } from 'date-fns/locale';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/dateUtil';
import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[],
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode: Episode) => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  objectFit="cover"
                  src={episode.thumbnail} 
                  alt={episode.title} 
                />
                
                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link> 
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
  
      <section className={styles.allEpisodes}>      
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode: Episode) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 70 }}>
                    <Image 
                      width={120} 
                      height={120} 
                      objectFit="cover"
                      src={episode.thumbnail} 
                      alt={episode.title} 
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>                    
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc,'
    }
  });

  const episodes: Episode[] = data.map((episode: any) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });

  const latestEpisodes: Episode[] = episodes.slice(0, 2);
  const allEpisodes: Episode[] = episodes.slice(2, episodes.length);
 
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
  }
}