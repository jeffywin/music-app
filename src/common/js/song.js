/**
 * Created by jeffywin on 2017/12/12.
 */
export default class Song { // 创建歌类
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) { // 工厂模式
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: createName(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function createName(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((val) => {
    ret.push(val.name)
  })
  return ret.join('/')
}
