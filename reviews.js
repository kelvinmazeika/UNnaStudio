/* =========================================================
   UNna Studio & Beleza — AVALIAÇÕES DO GOOGLE
   ---------------------------------------------------------
   👉 COMO ATUALIZAR (leva ~5 min, sem programar):
   1. Abra o seu perfil no Google (Google Maps → seu salão → Avaliações).
   2. Para cada avaliação, copie: nome, nota (estrelas), data e o texto.
   3. Edite a lista abaixo — uma entrada { } por avaliação, separadas por vírgula.
   4. Salve o arquivo. O carrossel se atualiza sozinho.

   Campos de cada avaliação:
     name   → nome de quem avaliou (ex.: "Mariana S.")
     rating → nota de 1 a 5
     date   → quando foi feita (ex.: "há 2 semanas")  [opcional]
     text   → o texto da avaliação
   ========================================================= */

window.UNNA_REVIEWS = [
  { name: "Janaína Silva",   rating: 5, date: "há 3 semanas", text: "Atendimento maravilhoso e design de sobrancelha excelente… acompanho as profissionais a mais de 10 anos e recomendo." },
  { name: "Stefany Medeiros Mazeika", rating: 5, date: "há 2 meses",     text: "Fui ao Studio UNna e tive uma experiência incrível! Fui recebida com muito carinho, e todos os tratamentos são de altíssima qualidade. Estou fazendo terapia capilar e já notei uma grande diferença: meu cabelo está crescendo mais rápido e muito mais saudável. Super recomendo! Sobrancelha também faço e Cílios, todos os procedimentos de alta qualidade." },
  { name: "Daniela Garcia",   rating: 5, date: "há 2 meses",     text: "Amo cada detalhe deste lugar! Acolhimento, educação, carinho, profissionalismo, a dedicação de cada profissional em tratar cada cliente de acordo com o que ele precisa! As profissionais São extremamente capacitaras e dedicadas! Além de ter o melhor comfort food aonde sempre tem um bolo com sabor de infância e os melhores chás que nos trazem sentimentos de amor e paz na Alma! Tanto eu quanto minha filha de 5 anos somos atendidas cada uma de acordo com a sua necessidade! Só gratidão e amor por esse lugar que ganhou nossos corações!" },
  { name: "Vânia Nascimento",   rating: 5, date: "há 2 meses",   text: "FMaravilhoso, produtos de ótima qualidade e profissional extremamente cordiais." },
  { name: "Joyce",  rating: 5, date: "há 2 meses",   text: "Salão sensacional, todas muito educadas e compreensivas, tem de tudo para sair de pronta e renovada, a esteticista Denise é sensacional, ela sabe exatamente o que você precisa só de olhar, analise clinica surreal!!!" }
];

/* Resumo exibido no topo da seção (ajuste para refletir o seu Google).
   average → deixe null para calcular automaticamente a partir da lista acima
   total   → total de avaliações no Google (pode ser maior que as exibidas)
   profileUrl → link do seu perfil no Google (botão "Ver todas no Google") */
window.UNNA_REVIEWS_META = {
  average: null,
  total: 10,
  // SUBSTITUIR: link direto do seu perfil/avaliações no Google
  profileUrl: "https://www.google.com/search?q=UNna+Studio+Beleza+São+Bernardo+do+Campo"
};
