<script>
  import { setChatMode, setError, setLoading } from "@/store";
  import Dropzone from "svelte-file-dropzone";

  let files = {
    accepted: [],
    rejected: [],
  };

  async function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    if (files.accepted.length > 0) {
      setLoading();

      const formData = new FormData();
      formData.append("file", files.accepted[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError();
        return;
      }

      const { id, url, pages } = await response.json();

      setChatMode({ id, url, pages });
    }
  }
</script>

<Dropzone on:drop={handleFilesSelect} multiple={false} accept="application/pdf">
  Arrastra tus archivos aqui o haz click para cargar los mismos
</Dropzone>
<ol>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ol>
