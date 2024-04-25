<script>
  import { PDFToChat, setError } from "@/store";
  import { Label, Input, Spinner } from "flowbite-svelte";

  const { id, url, pages } = $PDFToChat;

  let answer = "";
  let loading = false;

  const numOfImagesToShow = Math.min(3, pages);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    return url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${i + 1}/`)
      .replace(".pdf", ".jpg");
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    loading = true;

    const question = e.target[0].value;
    const searchParams = new URLSearchParams();
    searchParams.append("id", id);
    searchParams.append("question", question);

    try {
      const eventSource = new EventSource(
        `/api/chat?${searchParams.toString()}`
      );

      eventSource.onmessage = (event) => {
        loading = false;
        const incomingData = JSON.parse(event.data);

        if (incomingData === "__END__") {
          eventSource.close();
          return;
        }

        answer += incomingData;
      };
    } catch (e) {
      setError();
    } finally {
      loading = false;
    }
  };
</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img
      src={image}
      alt="PDF page"
      class="w-full h-auto object-cover rounded aspect-[400/540]"
    />
  {/each}
</div>

<form on:submit={handleSubmit} class="mt-8">
  <Label for="question-text" class="block mb-2">Preguntar al modelo</Label>
  <Input
    id="question-text"
    type="text"
    placeholder="¿De qué se trata este documento?"
    required
  ></Input>
</form>

{#if loading}
  <div class="flex items-center justify-center mt-8">
    <Spinner />
  </div>
{/if}

{#if answer}
  <div class="mt-8">
    <p>{answer}</p>
  </div>
{/if}
