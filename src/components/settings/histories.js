import objectValues from 'object.values';
import Vue from 'vue';
import Util from '../../common/util';

export default function (settings, histories) {
  const saveHistory = settings['save-history'];
  const component = Vue.extend({
    template: `
          <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp" style="max-width:980px">
            <div class="mdl-card mdl-cell mdl-cell--12-col">
              <div class="mdl-card__supporting-text">
                <h4>閲覧履歴</h4>
                <mdl-switch :checked.sync="saveHistory">履歴を保存する</mdl-switch>
                既に読んだ記事を表示しています。<mdl-button colored v-mdl-ripple-effect @click="clearHistoriesClick">閲覧履歴を消去する</mdl-button>
                <div>
                  <mdl-textfield floating-label="検索文字列" :value.sync="search"></mdl-textfield>
                </div>
                <ul>
                  <template v-for="item in items | filterBy search">
                    <li>
                      {{ item.date | moment "YYYY-MM-DD HH:mm"}}
                      <a href="http://qiita.com/{{item.userId}}/{{item.itemKind}}/{{item.itemId}}" target="_blank">{{ item.title }}</a>
                      @{{ item.userId }}
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <mdl-dialog v-ref:clear-histories-confirm title="閲覧履歴の消去">
              <p>閲覧履歴を消去します。よろしいですか？（ブラウザの履歴は消えません）</p>
              <template slot="actions">
                <mdl-button @click="clearHistories">消去する</mdl-button>
                <mdl-button @click="$refs.clearHistoriesConfirm.close">キャンセル</mdl-button>
              </template>
            </mdl-dialog>
          </section>`,
    data: () => {
      const items = objectValues(histories).sort((itemA, itemB) => (itemA.date < itemB.date) ? 1 : -1);
      const search = '';
      return {
        items,
        search,
        saveHistory
      };
    },
    methods: {
      clearHistoriesClick: function () {
        this.$refs.clearHistoriesConfirm.open();
      },
      clearHistories: function () {
        Util.clearHistories(() => {
          Util.infoLog('履歴を消しました');
          this.$refs.clearHistoriesConfirm.close();
          this.$data.items = [];
        });
      }
    },
    watch: {
      saveHistory: function (bool) {
        Util.saveSetting('save-history', bool);
      },
    }

  });
  return component;
}
