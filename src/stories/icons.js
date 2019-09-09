import { storiesOf } from '@storybook/vue';
import '../styles/icons/icons.svg';
import './icons.scss';

const noteMarkdown = `### Icon sprites should be imported to project

\`import '../styles/icons/icons.svg';\`

### Place icon

\`\`\`
<svg class=“icon“>
  <use xlink:href=“icons.svg#cloud“></use>
</svg> 
\`\`\`

### Depricated

\`xlink:href\` is [depricated](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xlink:href) use \`href\` instead.`;

const icons = ['search', 'backspace', 'note', 'tags'];

storiesOf('Icons', module).add(
  'All',
  () => ({
    data: function() {
      return {
        icons: icons.map(i => ({
          name: i,
          href: 'icons.svg#' + i
        }))
      };
    },

    template: `<div>
      <div class="story-icon_wrapper" v-for="icon in icons">
        <div class="story-icon_svg">
          <svg class="icon"><use :xlink:href="icon.href"></use></svg>
        </div>
        <div class="story-icon_label">{{icon.name}}</div>
      </div>
    </div>`
  }),
  {
    notes: {
      markdown: noteMarkdown
    }
  }
);
