<script lang="ts">
	import type { conn_styles } from "$lib/Chat/provider+connection";
	import dayjs from "dayjs";
    import advancedFormat from "dayjs/plugin/advancedFormat";
    dayjs.extend(advancedFormat);

    export let params: Date;
    export let style: conn_styles;

    const date = dayjs(params).format("dddd, [the] Do [of] MMMM YYYY").toLocaleLowerCase();
</script>

<div class="text-sm font-medium bg-{style.color_name}-100 dark:bg-{style.color_name}-800 px-2 py-1 flex">
    {date}
</div>