<template>
  <div class="fullView fullView02 select_lesson">
    <ul class="lessonUl">
      <li class="bg-btn">
        <router-link :to="{name: 'LevelList'}">
          <div class="sub">
            <div class="img">
              <img
                src="@/assets/image/common/img01.png"
                alt="レベルから学ぶ"
                width="20">
            </div>
            <p>
              <span class="txtSpan">レベル</span>から学ぶ
            </p>
          </div>
        </router-link>
      </li>
      <li class="bg-btn">
        <router-link :to="{name: 'GrammarList'}">
          <div class="sub">
            <div class="img">
              <img
                src="@/assets/image/common/img02.png"
                alt="文法から学ぶ"
                width="20">
            </div>
            <p>
              <span class="txtSpan">文法</span>から学ぶ
            </p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
