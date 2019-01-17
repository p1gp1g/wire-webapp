/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {t, setStrings} from 'utils/LocalizerUtil';

describe('LocalizerUtil', () => {
  describe('t', () => {
    it('can get localized strings', () => {
      setStrings({en: {wire: 'Wire'}});
      const result = t('wire');

      expect(result).toBe('Wire');
    });

    it('can replace placeholders in localized strings using shorthand string version', () => {
      setStrings({en: {hey: 'Hey {{name}}'}});

      const result = t('hey', 'Tod');

      expect(result).toBe('Hey Tod');
    });

    it('can replace placeholders in localized strings using shorthand number version', () => {
      setStrings({en: {text: 'Number {{name}} is alive'}});
      const result = t('text', 5);

      expect(result).toBe('Number 5 is alive');
    });

    it('can replace placeholders in localized strings using an object', () => {
      setStrings({en: {hey: 'Hey {{name}}'}});
      const result = t('hey', {name: 'Tod'});

      expect(result).toBe('Hey Tod');
    });

    it('can replace placeholders in localized strings using a more complex object', () => {
      setStrings({en: {greeting: '{{greeting}} {{name}}'}});

      const result = t('greeting', {greeting: 'Hey', name: 'Tod'});

      expect(result).toBe('Hey Tod');
    });

    it('can replace duplicate placeholders in localized strings using a more complex object', () => {
      setStrings({en: {greeting: '{{greeting}} {{greeting}} {{name}}'}});
      const result = t('greeting', {greeting: 'Hey', name: 'Tod'});

      expect(result).toBe('Hey Hey Tod');
    });

    it('escapes the raw string given', () => {
      setStrings({
        en: {
          test1: '<script>alert("fail")</script>',
          test2: '',
          test3: 'félix',
        },
      });

      expect(t('test1')).toBe('&lt;script&gt;alert(&quot;fail&quot;)&lt;/script&gt;');
      expect(t('test2')).toBe('');
      expect(t('test3')).toBe('félix');
    });

    it('escapes raw substitutions string or number', () => {
      setStrings({
        en: {
          test: '<scri>alert("{{userName}}")</scri>',
        },
      });

      const result1 = t('test', '<script>alert("felix")</script>');
      const result2 = t('test', 12);
      const result3 = t('test');

      expect(result1).toBe(
        '&lt;scri&gt;alert(&quot;&lt;script&gt;alert(&quot;felix&quot;)&lt;/script&gt;&quot;)&lt;/scri&gt;'
      );

      expect(result2).toBe('&lt;scri&gt;alert(&quot;12&quot;)&lt;/scri&gt;');
      expect(result3).toBe('&lt;scri&gt;alert(&quot;{{userName}}&quot;)&lt;/scri&gt;');
    });

    it('escapes substitutions object', () => {
      setStrings({
        en: {
          test1: '<scri>alert("{{user}}")</scri>',
          test2: '{{user}} {{user}} {{user}} Batman!',
          test3: 'Hello {{user}}, you are {{status}}',
        },
      });

      const result1 = t('test1', {user: '<script>alert("felix")</script>'});
      const result2 = t('test2', {user: 'nan'});
      const result3 = t('test3', {status: '<script>a pickle</script>', user: 'Rick'});

      expect(result1).toBe(
        '&lt;scri&gt;alert(&quot;&lt;script&gt;alert(&quot;felix&quot;)&lt;/script&gt;&quot;)&lt;/scri&gt;'
      );

      expect(result2).toBe('nan nan nan Batman!');

      expect(result3).toBe('Hello Rick, you are &lt;script&gt;a pickle&lt;/script&gt;');
    });

    it("doesn't escape substitutions acknowledged as dangerous", () => {
      setStrings({
        en: {
          test1: '[user]Felix[/user]',
          test2: '[user]{{user}}[user]',
        },
      });

      const result1 = t('test1', {}, {'/user': '</user>', user: '<user>'});
      const result2 = t('test2', {user: '<script>alert("felix")</script>'}, {user: '<user>'});

      expect(result1).toBe('<user>Felix</user>');
      expect(result2).toBe('<user>&lt;script&gt;alert(&quot;felix&quot;)&lt;/script&gt;<user>');
    });

    it('replaces default known tags', () => {
      setStrings({en: {test: '[bold]Felix[/bold] is [bold]a[/bold] [italic]pickle[/italic]'}});

      expect(t('test')).toBe('<b>Felix</b> is <b>a</b> <i>pickle</i>');
    });
  });
});
