<script lang="ts">
  let { expanded }: { expanded: boolean } = $props()
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
  class="size-4 transition-transform duration-200 {expanded ? 'rotate-90' : ''}"
>
  <path
    fill-rule="evenodd"
    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
    clip-rule="evenodd"
  />
</svg>
