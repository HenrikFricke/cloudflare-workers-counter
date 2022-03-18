document.addEventListener('alpine:init', () => {
  Alpine.data('counter', () => ({
    value: 0,
    async init() {
      const res = await fetch('/api/counter');
      const data = await res.json();
      this.value = `${data.counter}`;
    },
    get formattedValue() {
      return `${this.value}`;
    },
    async increase() {
      const res = await fetch('/api/increase', {
        method: 'PUT'
      });
      const data = await res.json();
      this.value = `${data.counter}`;
    },
    async decrease() {
      const res = await fetch('/api/decrease', {
        method: 'PUT'
      });
      const data = await res.json();
      this.value = `${data.counter}`;
    }
  }))
})
