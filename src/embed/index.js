const { loadImport } = require('../../misc');

/**
 * @typedef {import('eris').EmbedOptions} EmbedData
 * @typedef {typeof import('eris')} Eris
 */

const HEX_REGEX = /^#?([a-fA-F0-9]{6})$/;
const URL_REGEX = /^http(s)?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

class RichEmbed {
  /**
   * @param {EmbedData} data
   */
  constructor(data = {}) {
    if (data.title) this.title = data.title;
    if (data.description) this.description = data.description;
    if (data.url) this.url = data.url;
    if (data.timestamp) this.timestamp = data.timestamp;
    if (data.color) this.color = data.color;
    if (data.footer) this.footer = data.footer;
    if (data.image) this.image = data.image;
    if (data.thumbnail) this.thumbnail = data.thumbnail;
    if (data.author) this.author = data.author;
    this.fields = data.fields || [];
  }

  /**
   * @param {String} title
   */
  setTitle(title) {
    if (typeof title !== 'string') throw new TypeError(`Expected type 'string', received type '${typeof title}'`);
    if (title.length > 256) throw new RangeError('Embed titles cannot exceed 256 characters');
    this.title = title;
    return this;
  }

  /**
   * @param {String} description
   */
  setDescription(description) {
    if (typeof description !== 'string') throw new TypeError(`Expected type 'string', received type '${typeof description}'`);
    if (description.length > 2048) throw new RangeError('Embed titles cannot exceed 2048 characters');
    this.description = description;
    return this;
  }

  /**
   * @param {String} url
   */
  setURL(url) {
    if (typeof url !== 'string') throw new TypeError(`Expected type 'string', received type '${typeof url}'`);
    if (!URL_REGEX.test(url)) throw new Error('Not a well formed URL');
    this.url = url;
    return this;
  }

  /**
   * @param {DateConstructor} [timestamp]
   */
  setTimestamp(timestamp = new Date()) {
    if (Number.isNaN(new Date(timestamp).getTime())) throw new Error('Invalid Date');
    this.timestamp = new Date(timestamp);
    return this;
  }

  /**
   * @param {String|Number} color
   */
  setColor(color = 'RANDOM') {
    if (typeof color !== 'string' && typeof color !== 'number') throw new TypeError(`Expected types 'string' or 'number', received type ${typeof color} instead`);
    if (typeof color === 'number') {
      if (color > 16777215 || color < 0) throw new RangeError('Invalid color');
      this.color = color;
    } else {
      let clr;
      if (color === 'RANDOM') {
        const colorArr = ['#E52B50', '#FFBF00', '#9966CC', '#FBCEB1', '#7FFFD4', '#007FFF', '#89CFF0', '#F5F5DC', '#000000', '#0000FF', '#0095B6', '#8A2BE2', '#DE5D83', '#CB4154', '#CD7F32', '#964B00', '#800020', '#702963', '#960018', '#DE3163', '#007BA7', '#F7E7CE', '#7FFF00', '#7B3F00', '#0047AB', '#6F4E37', '#B87333', '#FF7F50', '#DC143C', '#00FFFF', '#EDC9Af', '#7DF9FF', '#50C878', '#00FF3F', '#FFD700', '#808080', '#008000', '#3FFF00', '#4B0082', '#FFFFF0', '#00A86B', '#29AB87', '#B57EDC', '#FFF700', '#C8A2C8', '#BFFF00', '#FF00FF', '#FF00AF', '#800000', '#E0B0FF', '#000080', '#CC7722', '#808000', '#FF6600', '#FF4500', '#DA70D6', '#FFE5B4', '#D1E231', '#CCCCFF', '#1C39BB', '#FD6C9E', '#8E4585', '#003153', '#CC8899', '#800080', '#E30B5C', '#FF0000', '#C71585', '#FF007F', '#E0115F', '#FA8072', '#92000A', '#0F52BA', '#FF2400', '#C0C0C0', '#708090', '#A7FC00', '#00FF7F', '#D2B48C', '#483C32', '#008080', '#40E0D0', '#3F00FF', '#7F00FF', '#40826D', '#FFFFFF', '#FFFF00'];
        clr = colorArr[Math.floor(Math.random()*colorArr.length)];
      }
      else {
        clr = color;
      }
      const match = clr.match(HEX_REGEX);
      if (!match) throw new Error('Invalid color');
      this.color = parseInt(match[1], 16);
    }

    return this;
  }

  /**
   * @param {String} text
   * @param {String} [iconURL]
   */
  setFooter(text, iconURL) {
    if (typeof text !== 'string') throw new TypeError(`Expected type 'string', received type ${typeof text}`);
    if (text.length > 2048) throw new RangeError('Embed footer texts cannot exceed 2048 characters');
    this.footer = { text };

    if (iconURL !== undefined) {
      if (typeof iconURL !== 'string') throw new TypeError(`Expected type 'string', received type '${typeof iconURL}'`);
      if (!iconURL.startsWith('attachment://') && !URL_REGEX.test(iconURL)) throw new Error('Not a well formed URL');
      this.footer.icon_url = iconURL;
    }

    return this;
  }

  /**
   * @param {String} imageURL
   */
  setImage(imageURL) {
    if (typeof imageURL !== 'string') throw new TypeError(`Expected type 'string', received type ${typeof imageURL}`);
    if (!imageURL.startsWith('attachment://') && !URL_REGEX.test(imageURL)) throw new Error('Not a well formed URL');
    this.image = { url: imageURL };
    return this;
  }

  /**
   * @param {String} thumbnailURL
   */
  setThumbnail(thumbnailURL) {
    if (typeof thumbnailURL !== 'string') throw new TypeError(`Expected type 'string', received type ${typeof thumbnailURL}`);
    if (!thumbnailURL.startsWith('attachment://') && !URL_REGEX.test(thumbnailURL)) throw new Error('Not a well formed URL');
    this.thumbnail = { url: thumbnailURL };
    return this;
  }

  /**
   * @param {String} name
   * @param {String} [url]
   * @param {String} [iconURL]
   */
  setAuthor(name, url, iconURL) {
    if (typeof name !== 'string') throw new TypeError(`Expected type 'string', received type ${typeof name}`);
    if (name.length > 256) throw new RangeError('Embed footer texts cannot exceed 2048 characters');
    this.author = { name };

    if (url !== undefined) {
      if (typeof url !== 'string') throw new TypeError(`Expected type 'string', received type '${typeof url}'`);
      if (!URL_REGEX.test(url)) throw new Error('Not a well formed URL');
      this.author.url = url;
    }

    if (iconURL !== undefined) {
      if (typeof iconURL !== 'string') throw new TypeError(`Expected type 'string', received type '${typeof iconURL}'`);
      if (!iconURL.startsWith('attachment://') && !URL_REGEX.test(iconURL)) throw new Error('Not a well formed URL');
      this.author.icon_url = iconURL;
    }

    return this;
  }

  /**
   * @param {String} name
   * @param {String} value
   * @param {Boolean} [inline]
   */
  addField(name = '\u200B', value = '\u200B', inline = false) {
    if (this.fields.length >= 25) throw new RangeError('Embeds cannot contain more than 25 fields');
    if (typeof name !== 'string') throw new TypeError(`Expected type 'string', received type ${typeof name}`);
    if (typeof value !== 'string') throw new TypeError(`Expected type 'string', received type ${typeof value}`);
    if (typeof inline !== 'boolean') throw new TypeError(`Expected type 'boolean', received type ${typeof inline}`);
    if (name.length > 256) throw new RangeError('Embed field names cannot exceed 256 characters');
    if (value.length > 1024) throw new RangeError('Embed field names cannot exceed 256 characters');

    this.fields.push({ name, value, inline });
    return this;
  }
}

class Embed extends RichEmbed {}

module.exports = RichEmbed;

/**
 * @param {Eris} E
 */
module.exports.init = (E) => {
  loadImport(E, RichEmbed);
  loadImport(E, Embed);
};
