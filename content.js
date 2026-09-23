/* =========================================================================
   CICLO — CONTEÚDO ESTÁTICO (v6.2.0)
   Textos, guias e frases. Nada aqui vai para o IndexedDB e nada vem da rede.

   Blocos: DAILY_QUOTES · REVIEW_METHOD_GUIDES · HELP_SECTIONS ·
           HELP_GLOSSARY · HELP_ARTICLES · HELP_FAQ · HIERARCHY_EXAMPLES ·
           CONTEXT_HELP · SCREEN_HELP · demonstrações · CHANGELOG

   v5.3 — fonte única: cada conceito tem UM texto. A busca, o FAQ, o
   glossário contextual, a ajuda de tela e a busca de comandos leem daqui.
   ========================================================================= */
'use strict';

/* =========================================================================
   FRASE DO DIA
   attributionStatus: verified | attributed | proverb | original
   "verified"  → autor histórico, obra em domínio público
   "attributed"→ circula amplamente, mas a autoria não é segura
   "proverb"   → provérbio / sabedoria popular
   "original"  → reflexão escrita para o Ciclo
   ========================================================================= */
const DAILY_QUOTES = [
  /* ---------- clássicos em domínio público ---------- */
  { id:1, text:'Só sei que nada sei.', author:'Sócrates', attributionStatus:'attributed', category:'curiosidade' },
  { id:2, text:'A educação é o melhor provimento para a velhice.', author:'Aristóteles', attributionStatus:'attributed', category:'longo prazo' },
  { id:3, text:'Somos aquilo que repetidamente fazemos. A excelência, portanto, não é um ato, mas um hábito.', author:'Will Durant, comentando Aristóteles', attributionStatus:'attributed', category:'consistência' },
  { id:4, text:'Conhece-te a ti mesmo.', author:'inscrição do templo de Delfos', attributionStatus:'verified', category:'aprendizagem' },
  { id:5, text:'A vida é curta, a arte é longa, a ocasião fugidia, a experiência enganosa, o julgamento difícil.', author:'Hipócrates', attributionStatus:'verified', category:'paciência' },
  { id:6, text:'Não é que tenhamos pouco tempo, é que perdemos muito dele.', author:'Sêneca', attributionStatus:'verified', category:'tempo' },
  { id:7, text:'Enquanto ensinamos, aprendemos.', author:'Sêneca', attributionStatus:'verified', category:'aprendizagem' },
  { id:8, text:'Nenhum vento é favorável para quem não sabe a que porto se dirige.', author:'Sêneca', attributionStatus:'attributed', category:'planejamento' },
  { id:9, text:'Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.', author:'Sêneca', attributionStatus:'verified', category:'esforço' },
  { id:10, text:'Comece: metade da obra está feita.', author:'Horácio', attributionStatus:'verified', category:'preparação' },
  { id:11, text:'A gota fura a pedra não pela força, mas por cair sempre.', author:'Ovídio', attributionStatus:'verified', category:'consistência' },
  { id:12, text:'O tempo escapa irreparavelmente.', author:'Virgílio', attributionStatus:'verified', category:'tempo' },
  { id:13, text:'Conheço um só bem: o saber; e um só mal: a ignorância.', author:'Diógenes Laércio', attributionStatus:'attributed', category:'aprendizagem' },
  { id:14, text:'Não são as coisas que perturbam os homens, mas as opiniões que eles têm sobre as coisas.', author:'Epicteto', attributionStatus:'verified', category:'foco' },
  { id:15, text:'É impossível alguém aprender aquilo que pensa já saber.', author:'Epicteto', attributionStatus:'verified', category:'curiosidade' },
  { id:16, text:'A felicidade da sua vida depende da qualidade dos seus pensamentos.', author:'Marco Aurélio', attributionStatus:'verified', category:'foco' },
  { id:17, text:'Não perca mais tempo discutindo o que um bom homem deve ser. Seja um.', author:'Marco Aurélio', attributionStatus:'verified', category:'disciplina' },
  { id:18, text:'Onde quer que haja um ser humano, há uma oportunidade para a gentileza.', author:'Sêneca', attributionStatus:'verified', category:'paciência' },
  { id:19, text:'O saber não ocupa lugar.', author:'provérbio', attributionStatus:'proverb', category:'aprendizagem' },
  { id:20, text:'Devagar se vai ao longe.', author:'provérbio', attributionStatus:'proverb', category:'consistência' },
  { id:21, text:'Água mole em pedra dura tanto bate até que fura.', author:'provérbio', attributionStatus:'proverb', category:'persistência' },
  { id:22, text:'Quem semeia, colhe.', author:'provérbio', attributionStatus:'proverb', category:'longo prazo' },
  { id:23, text:'Não deixes para amanhã o que podes fazer hoje.', author:'provérbio', attributionStatus:'proverb', category:'disciplina' },
  { id:24, text:'De grão em grão a galinha enche o papo.', author:'provérbio', attributionStatus:'proverb', category:'consistência' },
  { id:25, text:'A pressa é inimiga da perfeição.', author:'provérbio', attributionStatus:'proverb', category:'paciência' },
  { id:26, text:'Quem muito abarca, pouco aperta.', author:'provérbio', attributionStatus:'proverb', category:'foco' },
  { id:27, text:'Uma andorinha só não faz verão.', author:'provérbio', attributionStatus:'proverb', category:'consistência' },
  { id:28, text:'Antes tarde do que nunca.', author:'provérbio', attributionStatus:'proverb', category:'persistência' },
  { id:29, text:'Casa de ferreiro, espeto de pau.', author:'provérbio', attributionStatus:'proverb', category:'prática' },
  { id:30, text:'Errando é que se aprende.', author:'provérbio', attributionStatus:'proverb', category:'erro' },
  { id:31, text:'Cada macaco no seu galho.', author:'provérbio', attributionStatus:'proverb', category:'foco' },
  { id:32, text:'Para quem sabe ler, um pingo é letra.', author:'provérbio', attributionStatus:'proverb', category:'aprendizagem' },
  { id:33, text:'Quem não arrisca, não petisca.', author:'provérbio', attributionStatus:'proverb', category:'prática' },
  { id:34, text:'Mais vale um pássaro na mão do que dois voando.', author:'provérbio', attributionStatus:'proverb', category:'planejamento' },
  { id:35, text:'O apressado come cru.', author:'provérbio', attributionStatus:'proverb', category:'paciência' },
  { id:36, text:'Um dia de cada vez.', author:'provérbio', attributionStatus:'proverb', category:'consistência' },
  { id:37, text:'Quem espera sempre alcança.', author:'provérbio', attributionStatus:'proverb', category:'paciência' },
  { id:38, text:'Grão a grão se enche a medida.', author:'provérbio', attributionStatus:'proverb', category:'longo prazo' },
  { id:39, text:'Não se colhe fruto no dia em que se planta.', author:'provérbio', attributionStatus:'proverb', category:'longo prazo' },
  { id:40, text:'Quem caminha devagar, mas sempre, chega primeiro.', author:'provérbio', attributionStatus:'proverb', category:'consistência' },
  { id:41, text:'Aprender é como remar contra a corrente: quem para, retrocede.', author:'provérbio chinês', attributionStatus:'proverb', category:'consistência' },
  { id:42, text:'O melhor momento para plantar uma árvore foi há vinte anos. O segundo melhor é agora.', author:'provérbio', attributionStatus:'proverb', category:'preparação' },
  { id:43, text:'Diz-me e eu esqueço; ensina-me e eu lembro; envolve-me e eu aprendo.', author:'atribuída a Benjamin Franklin', attributionStatus:'attributed', category:'prática' },
  { id:44, text:'Um investimento em conhecimento paga os melhores juros.', author:'atribuída a Benjamin Franklin', attributionStatus:'attributed', category:'longo prazo' },
  { id:45, text:'Ao não se preparar, você está se preparando para falhar.', author:'atribuída a Benjamin Franklin', attributionStatus:'attributed', category:'preparação' },
  { id:46, text:'A leitura faz o homem completo; a conversa, ágil; e a escrita, exato.', author:'Francis Bacon', attributionStatus:'verified', category:'aprendizagem' },
  { id:47, text:'Se eu vi mais longe, foi por estar sobre ombros de gigantes.', author:'Isaac Newton', attributionStatus:'verified', category:'aprendizagem' },
  { id:48, text:'Nada na vida deve ser temido, somente compreendido. Agora é hora de compreender mais, para temer menos.', author:'Marie Curie', attributionStatus:'verified', category:'curiosidade' },
  { id:49, text:'Na vida, nada deve ser temido: tudo deve ser entendido.', author:'Marie Curie', attributionStatus:'attributed', category:'curiosidade' },
  { id:50, text:'A imaginação é mais importante que o conhecimento.', author:'Albert Einstein', attributionStatus:'attributed', category:'curiosidade' },
  { id:51, text:'Não tenho talento especial. Sou apenas apaixonadamente curioso.', author:'Albert Einstein', attributionStatus:'attributed', category:'curiosidade' },
  { id:52, text:'O importante é não parar de questionar.', author:'Albert Einstein', attributionStatus:'attributed', category:'curiosidade' },
  { id:53, text:'O gênio é um por cento de inspiração e noventa e nove por cento de transpiração.', author:'Thomas Edison', attributionStatus:'attributed', category:'esforço' },
  { id:54, text:'Não falhei. Apenas encontrei dez mil maneiras que não funcionam.', author:'atribuída a Thomas Edison', attributionStatus:'attributed', category:'erro' },
  { id:55, text:'A sorte favorece a mente preparada.', author:'Louis Pasteur', attributionStatus:'verified', category:'preparação' },
  { id:56, text:'Nossa maior fraqueza está em desistir. O caminho mais certo para vencer é tentar mais uma vez.', author:'atribuída a Thomas Edison', attributionStatus:'attributed', category:'persistência' },
  { id:57, text:'Aquele que move montanhas começa carregando pequenas pedras.', author:'provérbio chinês', attributionStatus:'proverb', category:'consistência' },
  { id:58, text:'Uma jornada de mil milhas começa com um único passo.', author:'Lao Tsé', attributionStatus:'attributed', category:'preparação' },
  { id:59, text:'Saber que se sabe o que se sabe, e que não se sabe o que não se sabe: eis o verdadeiro saber.', author:'Confúcio', attributionStatus:'attributed', category:'aprendizagem' },
  { id:60, text:'Aprender sem pensar é tempo perdido.', author:'Confúcio', attributionStatus:'attributed', category:'aprendizagem' },
  { id:61, text:'Não importa o quão devagar você vá, desde que não pare.', author:'atribuída a Confúcio', attributionStatus:'attributed', category:'persistência' },
  { id:62, text:'O homem que move uma montanha começa carregando as pedras menores.', author:'atribuída a Confúcio', attributionStatus:'attributed', category:'consistência' },
  { id:63, text:'A disciplina é a ponte entre metas e realizações.', author:'atribuída a Jim Rohn', attributionStatus:'attributed', category:'disciplina' },
  { id:64, text:'Educação é a arma mais poderosa que você pode usar para mudar o mundo.', author:'atribuída a Nelson Mandela', attributionStatus:'attributed', category:'aprendizagem' },
  { id:65, text:'Ninguém pode fazer você se sentir inferior sem o seu consentimento.', author:'atribuída a Eleanor Roosevelt', attributionStatus:'attributed', category:'persistência' },
  { id:66, text:'Quem tem um porquê enfrenta quase qualquer como.', author:'atribuída a Friedrich Nietzsche', attributionStatus:'attributed', category:'persistência' },
  { id:67, text:'A dúvida é o princípio da sabedoria.', author:'atribuída a Aristóteles', attributionStatus:'attributed', category:'curiosidade' },
  { id:68, text:'O que se aprende fazendo, aprende-se melhor.', author:'atribuída a Aristóteles', attributionStatus:'attributed', category:'prática' },
  { id:69, text:'A raiz da educação é amarga, mas o fruto é doce.', author:'atribuída a Aristóteles', attributionStatus:'attributed', category:'esforço' },
  { id:70, text:'Educar a mente sem educar o coração não é educar de forma alguma.', author:'atribuída a Aristóteles', attributionStatus:'attributed', category:'aprendizagem' },

  /* ---------- reflexões originais do Ciclo ---------- */
  { id:71, text:'Uma hora bem estudada vale mais que três horas distraídas.', author:null, attributionStatus:'original', category:'foco' },
  { id:72, text:'O objetivo da revisão não é confirmar que você viu o conteúdo, mas descobrir o que ainda consegue recuperar.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:73, text:'Constância pequena ainda é constância.', author:null, attributionStatus:'original', category:'consistência' },
  { id:74, text:'A preparação reduz o trabalho que a pressa cria.', author:null, attributionStatus:'original', category:'preparação' },
  { id:75, text:'Reler é confortável. Tentar lembrar é útil.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:76, text:'Estudar sem revisar é encher um balde furado com paciência.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:77, text:'Quem estuda todo dia um pouco não precisa de heroísmo na véspera.', author:null, attributionStatus:'original', category:'consistência' },
  { id:78, text:'O plano existe para você não gastar energia decidindo o óbvio.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:79, text:'Não confunda reconhecer a resposta com saber produzi-la.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:80, text:'Errar durante o estudo é barato. Errar na hora que importa, não.', author:null, attributionStatus:'original', category:'erro' },
  { id:81, text:'Vinte minutos hoje valem mais que duas horas que nunca acontecem.', author:null, attributionStatus:'original', category:'consistência' },
  { id:82, text:'A dificuldade de hoje costuma ser o conteúdo que você vai dominar primeiro.', author:null, attributionStatus:'original', category:'esforço' },
  { id:83, text:'Um conteúdo que você adia por semanas custa mais caro quando volta.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:84, text:'Anotar não é aprender. Anotar é preparar o terreno.', author:null, attributionStatus:'original', category:'prática' },
  { id:85, text:'Estudar cansado tem retorno menor do que descansar e voltar.', author:null, attributionStatus:'original', category:'foco' },
  { id:86, text:'Se você não consegue explicar em voz alta, provavelmente ainda não entendeu.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:87, text:'Quem estuda tudo ao mesmo tempo costuma não terminar nada.', author:null, attributionStatus:'original', category:'foco' },
  { id:88, text:'A meta semanal existe para orientar, não para punir.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:89, text:'Perder um dia não apaga o mês inteiro.', author:null, attributionStatus:'original', category:'persistência' },
  { id:90, text:'Comece pelo que está atrasado, não pelo que é mais confortável.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:91, text:'Esquecer faz parte. Reagendar a revisão também.', author:null, attributionStatus:'original', category:'paciência' },
  { id:92, text:'Cada revisão bem feita compra semanas de memória.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:93, text:'O material perfeito não existe. O estudo feito existe.', author:null, attributionStatus:'original', category:'prática' },
  { id:94, text:'Antes de começar, decida quando vai parar.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:95, text:'Um tópico difícil merece mais encontros curtos, não um encontro longo.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:96, text:'Você não precisa de motivação diária. Precisa de um próximo passo claro.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:97, text:'A pergunta certa na hora do estudo economiza horas depois.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:98, text:'Quem revisa no dia certo estuda menos e lembra mais.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:99, text:'Grifar o livro inteiro é decidir não escolher nada.', author:null, attributionStatus:'original', category:'foco' },
  { id:100, text:'Aprender é notar a diferença entre o que você achava que sabia e o que sabe.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:101, text:'O estudo curto que você faz vence o estudo ideal que você imagina.', author:null, attributionStatus:'original', category:'prática' },
  { id:102, text:'Estudar é um ofício: melhora com repetição orientada.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:103, text:'Se toda matéria é urgente, nenhuma é prioritária.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:104, text:'Registre o estudo: a memória do esforço é pior que a memória do conteúdo.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:105, text:'O melhor plano é aquele que você consegue cumprir numa semana ruim.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:106, text:'Descobrir uma lacuna é progresso, não fracasso.', author:null, attributionStatus:'original', category:'erro' },
  { id:107, text:'Estudar com o celular ao lado é estudar pela metade.', author:null, attributionStatus:'original', category:'foco' },
  { id:108, text:'Consistência é o que transforma esforço em resultado.', author:null, attributionStatus:'original', category:'consistência' },
  { id:109, text:'Adiar o conteúdo difícil aumenta o tamanho dele.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:110, text:'Quem sabe onde parou perde menos tempo para recomeçar.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:111, text:'A prova mede o que você recupera, não o que você reconheceu no livro.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:112, text:'Estude como se fosse explicar amanhã.', author:null, attributionStatus:'original', category:'prática' },
  { id:113, text:'Repetir o que já é fácil é descanso disfarçado de estudo.', author:null, attributionStatus:'original', category:'esforço' },
  { id:114, text:'Ritmo sustentável vence intensidade irregular.', author:null, attributionStatus:'original', category:'consistência' },
  { id:115, text:'O tempo que você não planeja é o tempo que você perde.', author:null, attributionStatus:'original', category:'tempo' },
  { id:116, text:'Uma boa revisão incomoda um pouco. Esse incômodo é o aprendizado acontecendo.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:117, text:'Não existe estudo perdido, existe estudo não revisado.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:118, text:'Divida o conteúdo até o primeiro pedaço parecer fácil de começar.', author:null, attributionStatus:'original', category:'preparação' },
  { id:119, text:'Cansaço não é sinal de aprendizado. Recuperação é.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:120, text:'Você não precisa dominar hoje. Precisa voltar amanhã.', author:null, attributionStatus:'original', category:'paciência' },
  { id:121, text:'Estudar pouco e sempre supera estudar muito e raramente.', author:null, attributionStatus:'original', category:'consistência' },
  { id:122, text:'A melhor técnica é aquela que você realmente usa.', author:null, attributionStatus:'original', category:'prática' },
  { id:123, text:'Avaliar honestamente como foi a revisão vale mais que fingir que foi bem.', author:null, attributionStatus:'original', category:'erro' },
  { id:124, text:'Ninguém aprende tudo de uma vez, e ninguém precisa.', author:null, attributionStatus:'original', category:'paciência' },
  { id:125, text:'Um cronograma rígido demais quebra na primeira semana atípica.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:126, text:'Feche as abas que não têm nada a ver com o que você decidiu estudar.', author:null, attributionStatus:'original', category:'foco' },
  { id:127, text:'Escrever o que lembra antes de abrir o material revela o que realmente ficou.', author:null, attributionStatus:'original', category:'prática' },
  { id:128, text:'Todo conteúdo parece fácil enquanto está aberto na sua frente.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:129, text:'Comparar seu ritmo com o dos outros raramente ensina alguma coisa.', author:null, attributionStatus:'original', category:'paciência' },
  { id:130, text:'Estudar bem é decidir bem onde colocar a próxima hora.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:131, text:'O silêncio de trinta minutos rende mais que duas horas interrompidas.', author:null, attributionStatus:'original', category:'foco' },
  { id:132, text:'Se o conteúdo não volta nunca, ele não foi aprendido: foi visitado.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:133, text:'Registrar dificuldade não é reclamar: é deixar um recado para o seu eu futuro.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:134, text:'Quem só estuda o que gosta chega torto na prova.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:135, text:'Todo plano precisa de uma folga, senão ele só funciona em semanas perfeitas.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:136, text:'Você aprende mais corrigindo um erro do que acertando dez vezes o fácil.', author:null, attributionStatus:'original', category:'erro' },
  { id:137, text:'A primeira revisão é a mais barata e a mais esquecida.', author:null, attributionStatus:'original', category:'preparação' },
  { id:138, text:'Estudar em pé, andando ou anotando: o formato importa menos que a recuperação.', author:null, attributionStatus:'original', category:'prática' },
  { id:139, text:'Persistir não é insistir no mesmo erro; é ajustar e continuar.', author:null, attributionStatus:'original', category:'persistência' },
  { id:140, text:'Uma meta que você nunca alcança deixa de ser meta e vira ruído.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:141, text:'Parar no meio de um assunto difícil facilita retomar depois.', author:null, attributionStatus:'original', category:'prática' },
  { id:142, text:'Não existe memória sem esquecimento. Existe revisão no momento certo.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:143, text:'O conteúdo que você mais adia é geralmente o que mais cai.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:144, text:'Estudar com propósito reduz o tempo necessário pela metade.', author:null, attributionStatus:'original', category:'foco' },
  { id:145, text:'Quem mede o próprio estudo descobre coisas que a sensação escondia.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:146, text:'Aprender é um processo lento que parece rápido quando olhamos para trás.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:147, text:'Não confie na sensação de fluência: ela some quando o livro fecha.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:148, text:'Comece pelo mais difícil enquanto a cabeça está descansada.', author:null, attributionStatus:'original', category:'preparação' },
  { id:149, text:'A disciplina é o que sustenta você nos dias sem vontade.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:150, text:'Estudar menos com atenção total é melhor que estudar muito pela metade.', author:null, attributionStatus:'original', category:'foco' },
  { id:151, text:'O progresso invisível de hoje é o resultado visível de daqui a três meses.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:152, text:'Se você acertou sem pensar, talvez ainda esteja só reconhecendo.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:153, text:'Um resumo escrito de memória vale mais que dez resumos copiados.', author:null, attributionStatus:'original', category:'prática' },
  { id:154, text:'Descanso também é parte do método.', author:null, attributionStatus:'original', category:'paciência' },
  { id:155, text:'O pior estudo é aquele que você não começou.', author:null, attributionStatus:'original', category:'prática' },
  { id:156, text:'Planejar demais é uma forma elegante de adiar.', author:null, attributionStatus:'original', category:'preparação' },
  { id:157, text:'Revisar é conversar com o que você foi ontem.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:158, text:'Ter o material organizado não é ter o conteúdo aprendido.', author:null, attributionStatus:'original', category:'prática' },
  { id:159, text:'Estudar é um investimento cujo juro composto é a memória.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:160, text:'Quando não souber por onde começar, comece pelo que vence antes.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:161, text:'Cada tópico que você domina reduz o peso do que ainda falta.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:162, text:'O caderno bonito não estuda por você.', author:null, attributionStatus:'original', category:'prática' },
  { id:163, text:'Duas semanas de constância mudam a sensação do conteúdo inteiro.', author:null, attributionStatus:'original', category:'consistência' },
  { id:164, text:'A dúvida anotada hoje é a pergunta respondida amanhã.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:165, text:'Estudar bem é escolher o que não estudar agora.', author:null, attributionStatus:'original', category:'foco' },
  { id:166, text:'Todo grande conteúdo cabe em pedaços pequenos e repetidos.', author:null, attributionStatus:'original', category:'consistência' },
  { id:167, text:'A pressa engole detalhes; os detalhes é que derrubam na prova.', author:null, attributionStatus:'original', category:'paciência' },
  { id:168, text:'Você não precisa se sentir pronto para começar. Precisa começar para se sentir pronto.', author:null, attributionStatus:'original', category:'preparação' },
  { id:169, text:'Aprender rápido demais costuma significar esquecer rápido também.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:170, text:'O histórico de estudo é o espelho mais honesto que existe.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:171, text:'Se a revisão parece fácil demais, talvez o intervalo devesse ser maior.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:172, text:'Trabalhar com o que falta é melhor do que lamentar o que passou.', author:null, attributionStatus:'original', category:'persistência' },
  { id:173, text:'Um bom estudante não é o que nunca esquece, é o que volta a tempo.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:174, text:'Interromper para conferir o celular custa mais que os segundos gastos.', author:null, attributionStatus:'original', category:'foco' },
  { id:175, text:'Comece com o que você consegue manter por um mês.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:176, text:'Fazer exercícios revela buracos que a leitura esconde.', author:null, attributionStatus:'original', category:'prática' },
  { id:177, text:'Quem confunde volume com progresso acaba cansado e no mesmo lugar.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:178, text:'Um conteúdo revisado três vezes bem vale dez leituras apressadas.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:179, text:'Estudar é treinar a recuperação, não a exposição.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:180, text:'A constância protege você do humor do dia.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:181, text:'Dias ruins também contam, desde que você apareça.', author:null, attributionStatus:'original', category:'persistência' },
  { id:182, text:'Não peça perfeição de si mesmo antes de pedir presença.', author:null, attributionStatus:'original', category:'paciência' },
  { id:183, text:'Guarde tempo para revisar, não só para avançar.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:184, text:'Avançar sem revisar é construir andares sobre fundação incompleta.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:185, text:'A curiosidade é o combustível mais barato que existe.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:186, text:'Perguntar por que funciona ensina mais que decorar que funciona.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:187, text:'O erro corrigido vira conhecimento; o erro ignorado vira hábito.', author:null, attributionStatus:'original', category:'erro' },
  { id:188, text:'Nenhuma técnica compensa a falta de retorno ao conteúdo.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:189, text:'Um plano semanal claro evita decisões difíceis às onze da noite.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:190, text:'Se você só estuda quando está inspirado, estuda pouco.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:191, text:'Meia hora com atenção plena muda o dia inteiro de estudo.', author:null, attributionStatus:'original', category:'foco' },
  { id:192, text:'A memória gosta de encontros curtos e frequentes.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:193, text:'Marcar o conteúdo como difícil hoje ajuda o sistema a te ajudar amanhã.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:194, text:'Estudar com objetivo é diferente de estudar com ansiedade.', author:null, attributionStatus:'original', category:'foco' },
  { id:195, text:'Aprender leva tempo, e tempo não se negocia — se organiza.', author:null, attributionStatus:'original', category:'tempo' },
  { id:196, text:'O conteúdo que você explica sem gaguejar é o conteúdo que você sabe.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:197, text:'Quem anota o que não entendeu volta com um mapa; quem não anota, volta perdido.', author:null, attributionStatus:'original', category:'prática' },
  { id:198, text:'Nenhum estudo é desperdiçado quando você sabe o que fez nele.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:199, text:'Trocar de matéria a cada cinco minutos é conversar sem ouvir.', author:null, attributionStatus:'original', category:'foco' },
  { id:200, text:'Comece devagar. Continue simples. Não pare.', author:null, attributionStatus:'original', category:'consistência' },
  { id:201, text:'Planejar a semana leva dez minutos e devolve horas.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:202, text:'A memória é reconstruída, não fotografada — por isso ela precisa de treino.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:203, text:'Fechar o material e tentar lembrar é o momento em que o estudo começa de verdade.', author:null, attributionStatus:'original', category:'prática' },
  { id:204, text:'Quem estuda com pressa relê; quem estuda com método recupera.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:205, text:'Não meça o estudo pelo tamanho do resumo, mas pelo que sobra sem ele.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:206, text:'Uma semana ruim não invalida um semestre bem construído.', author:null, attributionStatus:'original', category:'persistência' },
  { id:207, text:'Organize o material uma vez para não reorganizar toda semana.', author:null, attributionStatus:'original', category:'preparação' },
  { id:208, text:'A revisão atrasada é mais cara, mas continua valendo a pena.', author:null, attributionStatus:'original', category:'paciência' },
  { id:209, text:'O que você entende hoje precisa de encontros futuros para virar memória.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:210, text:'Interesse genuíno faz o conteúdo grudar sem esforço extra.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:211, text:'Evite estudar de forma que só funcione quando tudo está perfeito.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:212, text:'Estudar é escolher, repetidamente, o que merece sua atenção agora.', author:null, attributionStatus:'original', category:'foco' },
  { id:213, text:'A sensação de que você sabe é a última coisa em que confiar.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:214, text:'Repetir em voz alta expõe o que a leitura silenciosa escondia.', author:null, attributionStatus:'original', category:'prática' },
  { id:215, text:'Um pouco de dificuldade durante o estudo é sinal de que está funcionando.', author:null, attributionStatus:'original', category:'esforço' },
  { id:216, text:'Prefira terminar um tópico a começar quatro.', author:null, attributionStatus:'original', category:'foco' },
  { id:217, text:'Quem planeja folgas cumpre mais planos.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:218, text:'A disciplina não é sofrimento: é ter decidido antes de precisar decidir.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:219, text:'Anote a data em que entendeu algo difícil; você vai gostar de reler isso.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:220, text:'Não existe atalho, mas existe caminho mais organizado.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:221, text:'Estudar cinco dias por semana é melhor que estudar sete e desistir no mês seguinte.', author:null, attributionStatus:'original', category:'consistência' },
  { id:222, text:'Você só percebe o quanto avançou quando revisa o começo.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:223, text:'Conteúdo entendido e não praticado evapora.', author:null, attributionStatus:'original', category:'prática' },
  { id:224, text:'A melhor hora para estudar é a hora que você consegue sustentar toda semana.', author:null, attributionStatus:'original', category:'consistência' },
  { id:225, text:'Comparar-se com ontem é mais útil do que se comparar com qualquer outra pessoa.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:226, text:'Ter clareza do próximo passo é metade da motivação.', author:null, attributionStatus:'original', category:'preparação' },
  { id:227, text:'Um conteúdo revisado no limite do esquecimento fixa melhor.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:228, text:'Não estude para terminar a página; estude para conseguir explicar a página.', author:null, attributionStatus:'original', category:'prática' },
  { id:229, text:'Metas grandes demais viram desculpas pequenas.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:230, text:'Quem estuda para a semana inteira em um dia esquece na semana seguinte.', author:null, attributionStatus:'original', category:'consistência' },
  { id:231, text:'A repetição sem esforço ensina pouco; a recuperação com esforço ensina muito.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:232, text:'Dormir bem é parte do estudo, não pausa dele.', author:null, attributionStatus:'original', category:'paciência' },
  { id:233, text:'Se você trava ao explicar, encontrou exatamente onde estudar.', author:null, attributionStatus:'original', category:'erro' },
  { id:234, text:'Um cronômetro simples resolve metade dos problemas de dispersão.', author:null, attributionStatus:'original', category:'foco' },
  { id:235, text:'Fazer o básico todos os dias supera fazer o avançado uma vez por mês.', author:null, attributionStatus:'original', category:'consistência' },
  { id:236, text:'Os tópicos que você evita são os que mais precisam de você.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:237, text:'Estudo sem registro vira sensação; com registro, vira informação.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:238, text:'Aprender é aceitar ser iniciante muitas vezes seguidas.', author:null, attributionStatus:'original', category:'paciência' },
  { id:239, text:'A revisão de cinco minutos que você faz vale mais que a de trinta que você planeja.', author:null, attributionStatus:'original', category:'prática' },
  { id:240, text:'Escolher bem a próxima hora é mais importante que estender a hora atual.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:241, text:'Conteúdos parecidos confundem menos quando são praticados juntos.', author:null, attributionStatus:'original', category:'prática' },
  { id:242, text:'Todo assunto fica mais simples depois do terceiro encontro.', author:null, attributionStatus:'original', category:'persistência' },
  { id:243, text:'Você não está atrasado: está no ponto em que o seu esforço te trouxe.', author:null, attributionStatus:'original', category:'paciência' },
  { id:244, text:'Se a matéria é longa, o segredo é começar cedo, não correr no fim.', author:null, attributionStatus:'original', category:'preparação' },
  { id:245, text:'Estudar bem cansa menos do que estudar mal por mais tempo.', author:null, attributionStatus:'original', category:'foco' },
  { id:246, text:'Nem toda leitura é estudo; nem todo estudo é leitura.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:247, text:'Marcar o que ainda não domina é mais honesto que marcar o que já sabe.', author:null, attributionStatus:'original', category:'erro' },
  { id:248, text:'Um bom dia de estudo geralmente começou na noite anterior.', author:null, attributionStatus:'original', category:'preparação' },
  { id:249, text:'Quem estuda por objetivos claros desiste menos.', author:null, attributionStatus:'original', category:'persistência' },
  { id:250, text:'Manter o hábito é mais difícil e mais valioso que começar.', author:null, attributionStatus:'original', category:'consistência' },
  { id:251, text:'Cada revisão é uma pequena prova sem consequências.', author:null, attributionStatus:'original', category:'prática' },
  { id:252, text:'Sem descanso, o estudo continua acontecendo, mas para de render.', author:null, attributionStatus:'original', category:'paciência' },
  { id:253, text:'Dominar não é nunca errar: é errar menos e recuperar mais rápido.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:254, text:'A quantidade de horas impressiona; a distribuição delas é que ensina.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:255, text:'Um plano que ignora sua rotina real já nasce quebrado.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:256, text:'Estude o suficiente para conseguir dormir tranquilo, não para provar sofrimento.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:257, text:'Tentar lembrar e falhar ensina mais que ler e concordar.', author:null, attributionStatus:'original', category:'erro' },
  { id:258, text:'A memória responde melhor ao ritmo do que à intensidade.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:259, text:'Se você não sabe o que revisar, é sinal de que precisa registrar mais.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:260, text:'Fazer pouco hoje mantém a porta aberta para fazer mais amanhã.', author:null, attributionStatus:'original', category:'consistência' },
  { id:261, text:'O conhecimento antigo pede menos tempo, mas ainda pede atenção.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:262, text:'Estudar é transformar informação disponível em conhecimento recuperável.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:263, text:'Não tente estudar perfeito; tente estudar de novo.', author:null, attributionStatus:'original', category:'persistência' },
  { id:264, text:'Uma boa pergunta economiza três leituras.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:265, text:'A dificuldade percebida é um dado, não um veredito.', author:null, attributionStatus:'original', category:'erro' },
  { id:266, text:'Quem estuda cedo tem o resto do dia para esquecer com calma e revisar depois.', author:null, attributionStatus:'original', category:'tempo' },
  { id:267, text:'O objetivo não é estudar mais, é precisar estudar melhor.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:268, text:'Uma trilha clara vence a vontade momentânea.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:269, text:'O conteúdo não some porque você é ruim: some porque a memória funciona assim.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:270, text:'Marque o que ficou pela metade: recomeçar do zero custa caro.', author:null, attributionStatus:'original', category:'preparação' },
  { id:271, text:'A curiosidade sobrevive melhor quando você não se cobra perfeição.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:272, text:'Fazer exercícios antes de se sentir pronto acelera o aprendizado.', author:null, attributionStatus:'original', category:'prática' },
  { id:273, text:'Cada hora registrada é um argumento contra a sensação de que você não fez nada.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:274, text:'Estudo constante transforma prova em conferência, não em descoberta.', author:null, attributionStatus:'original', category:'preparação' },
  { id:275, text:'Não confunda ocupado com produtivo.', author:null, attributionStatus:'original', category:'foco' },
  { id:276, text:'Esforço bem direcionado cansa menos que esforço espalhado.', author:null, attributionStatus:'original', category:'esforço' },
  { id:277, text:'Voltar a um assunto antigo costuma ser mais rápido do que você imagina.', author:null, attributionStatus:'original', category:'paciência' },
  { id:278, text:'Decorar sem entender dura pouco; entender sem revisar dura pouco também.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:279, text:'Estude como quem constrói, não como quem empilha.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:280, text:'A rotina tira do estudo o peso da decisão diária.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:281, text:'Anotar em suas próprias palavras já é metade de aprender.', author:null, attributionStatus:'original', category:'prática' },
  { id:282, text:'Quando bater o desânimo, reduza o tamanho do estudo, não abandone o dia.', author:null, attributionStatus:'original', category:'persistência' },
  { id:283, text:'A clareza do objetivo determina a qualidade do esforço.', author:null, attributionStatus:'original', category:'foco' },
  { id:284, text:'Pequenos ajustes semanais superam grandes reformas anuais.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:285, text:'O conteúdo difícil merece o seu melhor horário, não as suas sobras.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:286, text:'Aprender exige tolerar um período em que nada parece fazer sentido.', author:null, attributionStatus:'original', category:'paciência' },
  { id:287, text:'Quem revisa cedo demais perde tempo; quem revisa tarde demais recomeça.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:288, text:'Confie no processo, mas confira os resultados.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:289, text:'Ler duas vezes é conforto. Escrever de memória é treino.', author:null, attributionStatus:'original', category:'prática' },
  { id:290, text:'Estudar bem é reduzir o número de coisas que competem pela sua atenção.', author:null, attributionStatus:'original', category:'foco' },
  { id:291, text:'Nenhum conteúdo é chato depois que você entende para que ele serve.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:292, text:'A constância é discreta: só aparece nos resultados.', author:null, attributionStatus:'original', category:'consistência' },
  { id:293, text:'Guardar cinco minutos para anotar o que aprendeu multiplica o valor do estudo.', author:null, attributionStatus:'original', category:'prática' },
  { id:294, text:'Terminar o dia sabendo o que fazer amanhã é meio caminho andado.', author:null, attributionStatus:'original', category:'preparação' },
  { id:295, text:'O estudo de longo prazo é feito de decisões pequenas e repetidas.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:296, text:'Não se cobre por dias perdidos; cobre-se por semanas abandonadas.', author:null, attributionStatus:'original', category:'persistência' },
  { id:297, text:'A prática espaçada parece mais lenta e é mais duradoura.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:298, text:'Cada erro registrado é um atalho oferecido ao seu eu futuro.', author:null, attributionStatus:'original', category:'erro' },
  { id:299, text:'O tempo passa de qualquer forma; a diferença é o que fica depois.', author:null, attributionStatus:'original', category:'tempo' },
  { id:300, text:'Estudar é um contrato silencioso com a pessoa que você quer ser.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:301, text:'Ninguém revisa tudo. Revise o que mais custa esquecer.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:302, text:'Estudos curtos e frequentes constroem o que maratonas raramente sustentam.', author:null, attributionStatus:'original', category:'consistência' },
  { id:303, text:'A vontade vem depois do início, quase nunca antes.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:304, text:'Um tópico dominado hoje ainda pede visitas ocasionais.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:305, text:'Escrever o que ficou confuso é mais produtivo que reler tudo.', author:null, attributionStatus:'original', category:'prática' },
  { id:306, text:'A melhor métrica é a que muda o seu comportamento na semana seguinte.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:307, text:'Quem sabe o que falta estuda com menos ansiedade.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:308, text:'Aprender é confortável no fim e desconfortável no meio.', author:null, attributionStatus:'original', category:'esforço' },
  { id:309, text:'Prefira dez minutos honestos a uma hora fingida.', author:null, attributionStatus:'original', category:'foco' },
  { id:310, text:'Cada conteúdo tem um ritmo próprio; respeite-o sem abandoná-lo.', author:null, attributionStatus:'original', category:'paciência' },
  { id:311, text:'Estudar em ordem aleatória confunde; em ordem rígida, engessa.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:312, text:'Uma pergunta que você não sabe responder é um mapa do que estudar.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:313, text:'O maior inimigo do estudo raramente é a dificuldade: é a interrupção.', author:null, attributionStatus:'original', category:'foco' },
  { id:314, text:'Pequeno e diário derrota grande e ocasional.', author:null, attributionStatus:'original', category:'consistência' },
  { id:315, text:'Você aprende quando o cérebro trabalha, não quando os olhos passam.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:316, text:'Não espere sentir-se produtivo para produzir.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:317, text:'Ter menos matérias abertas ao mesmo tempo reduz o cansaço mental.', author:null, attributionStatus:'original', category:'foco' },
  { id:318, text:'A revisão é o momento em que o estudo antigo paga dividendos.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:319, text:'Desistir de um método não é desistir do objetivo.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:320, text:'Transformar dúvida em pergunta escrita já organiza metade do raciocínio.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:321, text:'O plano serve ao estudo, não o contrário.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:322, text:'Não julgue o estudo pelo humor; julgue pelo que ficou registrado.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:323, text:'É melhor entender três exemplos do que decorar dez definições.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:324, text:'Constância não exige entusiasmo, apenas presença.', author:null, attributionStatus:'original', category:'consistência' },
  { id:325, text:'A memória esquece o que nunca foi cobrada a lembrar.', author:null, attributionStatus:'original', category:'prática' },
  { id:326, text:'Ajuste o plano quando a vida mudar; abandoná-lo é outra coisa.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:327, text:'Aprender bem hoje é economizar tempo em todos os dias seguintes.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:328, text:'Se o assunto parece impossível, o pedaço escolhido ainda está grande demais.', author:null, attributionStatus:'original', category:'preparação' },
  { id:329, text:'Quem estuda com método troca ansiedade por previsibilidade.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:330, text:'Respeitar o próprio limite é o que permite continuar amanhã.', author:null, attributionStatus:'original', category:'paciência' },
  { id:331, text:'Nada substitui o ato de tentar responder antes de conferir.', author:null, attributionStatus:'original', category:'prática' },
  { id:332, text:'Um bom estudante coleciona dúvidas resolvidas, não páginas lidas.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:333, text:'O progresso costuma ser silencioso até virar evidente.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:334, text:'Estudar sem meta é caminhar sem destino: cansa igual, chega menos.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:335, text:'Termine o estudo anotando onde recomeçar.', author:null, attributionStatus:'original', category:'preparação' },
  { id:336, text:'Todo esforço bem distribuído parece menor do que foi.', author:null, attributionStatus:'original', category:'esforço' },
  { id:337, text:'O que você pratica é o que você se torna capaz de fazer.', author:null, attributionStatus:'original', category:'prática' },
  { id:338, text:'Se estudar virou sofrimento constante, o problema costuma ser o método.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:339, text:'Aprender exige coragem de ficar confuso por um tempo.', author:null, attributionStatus:'original', category:'paciência' },
  { id:340, text:'Escolher três prioridades da semana já organiza o resto.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:341, text:'A memória de longo prazo é construída por visitas, não por mudanças.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:342, text:'Estudar é menos sobre inteligência e mais sobre retorno ao conteúdo.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:343, text:'Um bom estudo termina com você sabendo o que ainda não sabe.', author:null, attributionStatus:'original', category:'erro' },
  { id:344, text:'Comece pelo que você entende e avance até onde trava.', author:null, attributionStatus:'original', category:'preparação' },
  { id:345, text:'A rotina é um empréstimo de disciplina para os dias difíceis.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:346, text:'Ler rápido é habilidade; lembrar depois é o objetivo.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:347, text:'Os melhores resultados vêm de sistemas simples repetidos por muito tempo.', author:null, attributionStatus:'original', category:'consistência' },
  { id:348, text:'Se você adiou de novo, reduza a tarefa até ela caber no seu dia.', author:null, attributionStatus:'original', category:'persistência' },
  { id:349, text:'A pausa planejada protege as horas seguintes.', author:null, attributionStatus:'original', category:'foco' },
  { id:350, text:'Marcar um conteúdo como difícil é pedir ajuda ao seu próprio sistema.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:351, text:'Você não precisa gostar do assunto para estudá-lo bem.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:352, text:'Quem revisa antes de esquecer completamente gasta menos energia.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:353, text:'Muitos resumos e pouca prática produzem confiança sem competência.', author:null, attributionStatus:'original', category:'prática' },
  { id:354, text:'Estudar com intenção de ensinar muda tudo o que você percebe.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:355, text:'Um plano flexível sobrevive; um plano perfeito quebra.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:356, text:'Melhor terminar sem brilho do que abandonar com estilo.', author:null, attributionStatus:'original', category:'persistência' },
  { id:357, text:'A atenção é o recurso mais escasso de qualquer estudante.', author:null, attributionStatus:'original', category:'foco' },
  { id:358, text:'Progresso é conseguir hoje o que travava você há um mês.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:359, text:'Não adianta apressar a memória: ela cobra o intervalo dela.', author:null, attributionStatus:'original', category:'paciência' },
  { id:360, text:'Todo tempo dedicado à organização deve devolver tempo ao estudo.', author:null, attributionStatus:'original', category:'preparação' },
  { id:361, text:'Recuperar é mais difícil que reconhecer — e é exatamente por isso que ensina.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:362, text:'Fazer a parte chata primeiro deixa o resto mais leve.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:363, text:'Aprender algo difícil é uma sequência de pequenas rendições ao esforço.', author:null, attributionStatus:'original', category:'esforço' },
  { id:364, text:'O dia que você quase não estudou ainda conta mais que o dia que não estudou.', author:null, attributionStatus:'original', category:'consistência' },
  { id:365, text:'Revisar é lembrar de propósito antes de precisar lembrar por obrigação.', author:null, attributionStatus:'original', category:'preparação' },
  { id:366, text:'Estude hoje o que você não quer improvisar depois.', author:null, attributionStatus:'original', category:'preparação' },
  { id:367, text:'Um erro entendido vale por vários acertos automáticos.', author:null, attributionStatus:'original', category:'erro' },
  { id:368, text:'A memória prefere encontros espaçados a maratonas apertadas.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:369, text:'Quem registra o próprio estudo para de discutir com a própria sensação.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:370, text:'Escolher menos matérias por dia é escolher lembrar mais.', author:null, attributionStatus:'original', category:'foco' },
  { id:371, text:'Todo conteúdo tem um primeiro passo pequeno; encontre-o.', author:null, attributionStatus:'original', category:'preparação' },
  { id:372, text:'Estudar por prazer e estudar por meta podem conviver.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:373, text:'O acúmulo de revisões diminui quando você revisa um pouco todo dia.', author:null, attributionStatus:'original', category:'consistência' },
  { id:374, text:'Confiança sem checagem costuma ser só familiaridade.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:375, text:'Quem ajusta o plano toda semana raramente precisa refazê-lo do zero.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:376, text:'Não confunda começar de novo com nunca ter avançado.', author:null, attributionStatus:'original', category:'persistência' },
  { id:377, text:'Estudar em silêncio por meia hora é um luxo acessível.', author:null, attributionStatus:'original', category:'foco' },
  { id:378, text:'Cada tópico revisado no prazo é um problema a menos na véspera.', author:null, attributionStatus:'original', category:'preparação' },
  { id:379, text:'Se o conteúdo sai fácil da cabeça, ele ainda não entrou direito.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:380, text:'Estudar é um hábito que se protege, não um humor que se espera.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:381, text:'A paciência não é lentidão: é aceitar o tempo que o aprendizado exige.', author:null, attributionStatus:'original', category:'paciência' },
  { id:382, text:'Pequenas melhorias no método rendem mais que grandes aumentos de horas.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:383, text:'Praticar recuperar é praticar exatamente o que a prova pede.', author:null, attributionStatus:'original', category:'prática' },
  { id:384, text:'Um bom sistema devolve o tempo que você gastou montando ele.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:385, text:'A vontade oscila; o horário marcado não.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:386, text:'Reservar tempo para revisar é reservar tempo para não reaprender.', author:null, attributionStatus:'original', category:'tempo' },
  { id:387, text:'A curiosidade transforma obrigação em investigação.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:388, text:'Errar cedo é mais barato do que errar tarde.', author:null, attributionStatus:'original', category:'erro' },
  { id:389, text:'O conhecimento que você usa é o que permanece.', author:null, attributionStatus:'original', category:'prática' },
  { id:390, text:'Adiar decisões pequenas consome a energia das decisões importantes.', author:null, attributionStatus:'original', category:'foco' },
  { id:391, text:'Estudar bem em uma hora exige decidir antes o que fazer nela.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:392, text:'A régua certa é o seu progresso, não o calendário dos outros.', author:null, attributionStatus:'original', category:'paciência' },
  { id:393, text:'Persistência é voltar depois da interrupção, não nunca ser interrompido.', author:null, attributionStatus:'original', category:'persistência' },
  { id:394, text:'Quem revisa com honestidade acelera; quem revisa por formalidade, não.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:395, text:'O caderno serve para pensar, não só para guardar.', author:null, attributionStatus:'original', category:'prática' },
  { id:396, text:'Conhecimento acumulado sem organização vira peso.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:397, text:'Cada retomada fica mais rápida que a anterior.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:398, text:'Aprender é reduzir, aos poucos, a distância entre ler e conseguir explicar.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:399, text:'Nenhum recomeço é do zero quando existe histórico.', author:null, attributionStatus:'original', category:'persistência' },
  { id:400, text:'Estude hoje uma hora que amanhã agradeça.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:401, text:'A revisão bem colocada é o que separa estudar de ter estudado.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:402, text:'Quem organiza o conteúdo antes de estudar perde menos tempo dentro dele.', author:null, attributionStatus:'original', category:'preparação' },
  { id:403, text:'Não existe método único; existe método ajustado ao conteúdo.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:404, text:'Escutar uma explicação é fácil; reproduzi-la é a prova real.', author:null, attributionStatus:'original', category:'prática' },
  { id:405, text:'A disciplina de hoje é a liberdade de amanhã.', author:null, attributionStatus:'original', category:'disciplina' },
  { id:406, text:'Todo estudante avançado já foi alguém que não entendia o básico.', author:null, attributionStatus:'original', category:'paciência' },
  { id:407, text:'Registrar o tempo transforma intenção em evidência.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:408, text:'Estudar é escolher dificuldade agora para evitar dificuldade maior depois.', author:null, attributionStatus:'original', category:'esforço' },
  { id:409, text:'Quem entende o porquê esquece menos o como.', author:null, attributionStatus:'original', category:'curiosidade' },
  { id:410, text:'Um plano cumprido pela metade ainda é melhor que nenhum plano.', author:null, attributionStatus:'original', category:'planejamento' },
  { id:411, text:'A memória agradece intervalos; a ansiedade, não. Siga a memória.', author:null, attributionStatus:'original', category:'longo prazo' },
  { id:412, text:'Antes de buscar um método novo, tente aplicar bem o antigo.', author:null, attributionStatus:'original', category:'melhoria contínua' },
  { id:413, text:'A diferença entre saber e achar que sabe aparece quando o material fecha.', author:null, attributionStatus:'original', category:'aprendizagem' },
  { id:414, text:'Estudar é uma sequência de retornos, não uma linha reta.', author:null, attributionStatus:'original', category:'persistência' },
  { id:415, text:'Escolha o próximo tópico com a cabeça de hoje, não com a culpa de ontem.', author:null, attributionStatus:'original', category:'foco' },
  { id:416, text:'O tempo bem investido no básico sustenta todo o avançado.', author:null, attributionStatus:'original', category:'preparação' },
  { id:417, text:'Nem todo dia rende igual, e tudo bem: o que conta é a soma.', author:null, attributionStatus:'original', category:'consistência' },
  { id:418, text:'Aprender é permitir que a versão anterior de você esteja errada.', author:null, attributionStatus:'original', category:'erro' },
  { id:419, text:'Termine o estudo antes que o cansaço decida por você.', author:null, attributionStatus:'original', category:'paciência' },
  { id:420, text:'O melhor sistema de estudos é aquele que você ainda estará usando em seis meses.', author:null, attributionStatus:'original', category:'longo prazo' }
];

/* =========================================================================
   GUIAS DOS MÉTODOS DE REVISÃO
   Cada método tem: rótulo, frase de uma linha, passos e quando usar.
   ========================================================================= */
const REVIEW_METHOD_GUIDES = {
  active_recall: {
    label:'Recordação ativa',
    short:'Tente lembrar antes de olhar o material.',
    intro:'Você fecha o material e tenta recuperar o conteúdo de memória. Só depois confere.',
    steps:[
      'Não abra o material no começo.',
      'Tente recuperar o que lembra — em voz alta, escrevendo ou mentalmente.',
      'Perceba onde você travou: essas são as lacunas.',
      'Abra o material e confira.',
      'Corrija e reforce exatamente o que faltou.'
    ],
    good:'Serve para quase todo conteúdo. É o método padrão quando não há um melhor.'
  },
  exercises: {
    label:'Exercícios',
    short:'Resolva questões antes de olhar a resposta.',
    intro:'Você pratica resolvendo problemas, sem consultar a solução de imediato.',
    steps:[
      'Escolha algumas questões do assunto.',
      'Resolva sem consultar a resposta.',
      'Confira e observe onde errou.',
      'Revise apenas os pontos que geraram erro.'
    ],
    good:'Ideal para matérias de cálculo, lógica, questões de prova e conteúdo aplicado.'
  },
  explanation: {
    label:'Explicação',
    short:'Explique com palavras simples, como se ensinasse alguém.',
    intro:'Você tenta explicar o assunto do zero, sem jargão, como se a outra pessoa não soubesse nada.',
    steps:[
      'Escolha o conceito e explique em voz alta ou por escrito.',
      'Use palavras simples, evite decorar a frase do livro.',
      'Onde você travar ou ficar vago, existe uma lacuna.',
      'Volte ao material só nesses pontos e explique de novo.'
    ],
    good:'Excelente para conteúdo conceitual, teorias, processos e definições.'
  },
  memory_summary: {
    label:'Resumo de memória',
    short:'Escreva o que lembra antes de consultar.',
    intro:'Você escreve um resumo do assunto sem abrir nada. O material serve apenas para conferir depois.',
    steps:[
      'Pegue uma folha em branco.',
      'Escreva tudo que lembra sobre o tópico.',
      'Só então abra o material.',
      'Compare, complete o que faltou e destaque o que esqueceu.'
    ],
    good:'Bom para conteúdo extenso e para descobrir rapidamente o que ficou de fora.'
  },
  flashcards: {
    label:'Flashcards',
    short:'Pergunta de um lado, resposta do outro.',
    intro:'Você usa cartões com pergunta e resposta para treinar recuperação rápida de fatos.',
    steps:[
      'Use cartões de papel ou um aplicativo de flashcards da sua preferência.',
      'Leia a pergunta e responda antes de virar o cartão.',
      'Separe os que errou para repetir mais vezes.',
      'Registre aqui como foi a revisão quando terminar.'
    ],
    good:'Bom para vocabulário, fórmulas, datas, termos e definições curtas.',
    note:'O Ciclo não tem um sistema próprio de flashcards — ele agenda a revisão e você usa a ferramenta que preferir.'
  },
  interleaving: {
    label:'Prática intercalada',
    short:'Misture tipos de problema em vez de repetir só um.',
    intro:'Em vez de fazer vinte exercícios iguais, você mistura tipos parecidos e precisa decidir qual abordagem usar.',
    steps:[
      'Junte exercícios de dois ou três tipos relacionados.',
      'Embaralhe a ordem.',
      'Ao ler cada questão, decida primeiro qual método aplicar.',
      'Resolva e confira.'
    ],
    good:'Muito útil quando você acerta treinando, mas confunde os tipos na prova.'
  },
  free: {
    label:'Revisão livre',
    short:'Você escolhe como revisar.',
    intro:'Sem roteiro: use a abordagem que fizer mais sentido para este conteúdo hoje.',
    steps:[
      'Decida o que quer verificar neste tópico.',
      'Use a forma que preferir.',
      'Ao final, registre honestamente como foi.'
    ],
    good:'Para quando você já sabe o que precisa fazer e não quer um roteiro.'
  }
};

/* =========================================================================
   AJUDA v5.3 — ARQUITETURA

   A Central de Ajuda tem DOIS caminhos principais e dois recursos de apoio:

     USAR O CICLO        · como a ferramenta funciona
     APRENDER A ESTUDAR  · como estudar melhor
     Primeiros passos    · entrada rápida para quem chegou agora
     FAQ e Glossário     · apoio, nunca portas concorrentes

   Tudo abaixo é a FONTE ÚNICA de conteúdo: a busca, o FAQ, o glossário
   contextual, a ajuda de tela e a busca de comandos leem daqui. Nada é
   duplicado e nada vai para o IndexedDB.

   Bloco de artigo (content):
     { h }        subtítulo
     { p }        parágrafo (aceita [[termo]] do glossário)
     { ul }       lista curta
     { ol }       lista ordenada dentro do texto
     { steps }    guia passo a passo numerado
     { note }     observação em destaque discreto
     { tree }     modelo visual Área → Disciplina → Tópico
     { demo }     exemplo interativo (apenas em memória)
     { details }  aprofundamento recolhido ("Entenda em mais detalhes")
   ========================================================================= */

/** Os dois caminhos principais e seus grupos de tarefas humanas. */
const HELP_SECTIONS = [
  {
    id:'usar', label:'Usar o Ciclo', icon:'i-disc',
    short:'Organize seus estudos, planeje, revise, acompanhe progresso e use as funções do Ciclo.',
    groups:[
      { id:'comecando',   label:'Começando' },
      { id:'organizando', label:'Organizando meus estudos' },
      { id:'estudando',   label:'Estudando' },
      { id:'semana',      label:'Organizando minha semana' },
      { id:'revisando',   label:'Revisando' },
      { id:'progresso',   label:'Entendendo meu progresso' },
      { id:'dados',       label:'Meus dados' },
      { id:'navegacao',   label:'Navegação e atalhos' }
    ]
  },
  {
    id:'aprender', label:'Aprender a estudar', icon:'i-help',
    short:'Entenda revisão, memória, exercícios, recordação ativa e outros métodos.',
    groups:[
      { id:'aprender-melhor', label:'Como aprender melhor?' },
      { id:'como-revisar',    label:'Como revisar?' },
      { id:'praticar',        label:'Como praticar?' },
      { id:'tempo',           label:'Como organizar o tempo?' }
    ]
  }
];

/* =========================================================================
   GLOSSÁRIO — FONTE ÚNICA

   `short`   explicação imediata (tooltip, popover no celular, FAQ curto)
   `article` onde está a explicação completa
   `alias`   outras formas de escrever o termo (busca)
   `proper`  nome próprio: não vira minúscula dentro de uma frase

   Um termo aparece marcado no texto com [[chave]]. O rótulo exibido vem
   daqui, então a palavra na tela e a definição nunca divergem.
   ========================================================================= */
const HELP_GLOSSARY = {
  areaEstudo: { term:'Área de Estudo', article:'estrutura-conteudo', proper:true, alias:'area areas contexto grupo',
    short:'Opcional. Reúne disciplinas relacionadas — Faculdade, Trabalho, Música. Serve só para organizar e não tem prioridade.' },
  disciplina: { term:'Disciplina', article:'disciplinas', alias:'materia matéria assunto curso',
    short:'Aquilo que você estuda. Todo estudo registrado fica ligado a uma disciplina.' },
  topico: { term:'Tópico', article:'topicos', alias:'assunto conteudo parte capitulo',
    short:'Uma parte de uma disciplina. É o tópico que entra no ciclo de revisão e mostra seu progresso no conteúdo.' },
  sessao: { term:'Estudo registrado', article:'sessoes', alias:'sessao sessão sessoes de estudo registro bloco tempo',
    short:'Cada vez que você estuda e registra: disciplina, tempo e, se quiser, tópico, tipo e dificuldade. Nas Análises aparece como "sessões de estudo".' },
  prioridade: { term:'Prioridade', article:'prioridades', alias:'peso importancia importância escala',
    short:'De 1 (muito baixa) a 5 (muito alta). Indica quanto algo merece sua atenção agora. O padrão é 3.' },
  minimoSemanal: { term:'Mínimo semanal', article:'distribuicao', alias:'minimo piso garantido reserva',
    short:'Tempo reservado para uma disciplina antes de qualquer divisão, para ela não ser esquecida.' },
  disponibilidade: { term:'Disponibilidade semanal', article:'planejamento', alias:'horas semana tempo capacidade',
    short:'Quantas horas por semana você pretende estudar. É o número que sustenta todo o planejamento.' },
  planoBase: { term:'Plano semanal', article:'plano-base', alias:'plano base modelo semanal padrão padrao distribuicao',
    short:'O modelo de divisão do seu tempo por semana. Cada semana guarda uma cópia do plano que valia nela.' },
  aderencia: { term:'Plano cumprido', article:'planejado-realizado', alias:'aderencia aderência meta porcentagem planejado realizado',
    short:'Quanto do tempo planejado foi de fato estudado no período. 100% é ter cumprido exatamente o previsto.' },
  cobertura: { term:'Conteúdo estudado', article:'cobertura-dominio', alias:'cobertura percentual topicos progresso',
    short:'A parte dos tópicos que você já estudou pelo menos uma vez.' },
  dominio: { term:'Consolidação', article:'dominio', alias:'dominio domínio retencao retenção consolidado dominar memoria',
    short:'Uma estimativa, de 1 a 5, de quanto um tópico já está firme na memória, com base nos resultados das suas revisões.' },
  dificuldade: { term:'Dificuldade', article:'dificuldade', alias:'esforco esforço percepcao percebida',
    short:'De 1 a 5, quanto aquele estudo pareceu difícil para você. É só para análise: não altera créditos nem revisões.' },
  credito: { term:'Crédito', article:'creditos', alias:'creditos unidade conversao minutos',
    short:'Uma unidade de acompanhamento. Cada disciplina define quantos minutos valem 1 crédito (o padrão é 20).' },
  prazo: { term:'Prazo', article:'prazos', alias:'prova trabalho entrega projeto data tarefa',
    short:'Uma data que importa: prova, trabalho, entrega. Pesa mais conforme a data chega e conforme a prioridade dele.' },
  escopo: { term:'Escopo', article:'analises', alias:'o que analisar filtro recorte',
    short:'Nas Análises, aquilo que está sendo analisado: tudo, uma Área de Estudo, uma disciplina ou um tópico.' },
  revisao: { term:'Revisão', article:'o-que-e-revisao', alias:'revisar rever retomar',
    short:'Voltar a um conteúdo já estudado para testar o que você ainda consegue lembrar — antes de consultar.' },
  estrategiaRevisao: { term:'Quando revisar', article:'quando-revisar', alias:'estrategia estratégia de revisao adaptativa ciclo programado intensiva manutencao ritmo',
    short:'O ritmo com que um tópico volta: adaptativa (o padrão), ciclo programado, intensiva ou manutenção.' },
  metodoRevisao: { term:'Como revisar', article:'metodos-revisao', alias:'metodo método de revisao recordacao exercicios explicacao flashcards',
    short:'O que fazer durante a revisão: tentar lembrar, resolver exercícios, explicar, escrever de memória, flashcards…' },
  intervaloRevisao: { term:'Tempo até a próxima revisão', article:'quando-revisar', alias:'intervalo de revisao dias espaco proxima data',
    short:'Quantos dias faltam até o tópico voltar. Cresce quando você lembra bem e encurta quando você esquece.' },
  naturezaConteudo: { term:'Tipo de conteúdo', article:'metodos-revisao', alias:'natureza do conteudo conceitual memorizacao problemas pratica misto',
    short:'Se a disciplina é mais conceitual, de memorização, de resolução de problemas ou prática. Ajuda o Ciclo a sugerir como revisar.' },
  recomendacao: { term:'Recomendação', article:'como-o-ciclo-sugere', alias:'sugestao proxima sessao hoje',
    short:'A sugestão do que estudar agora, calculada no seu navegador por regras fixas — e sempre explicada em texto.' },
  recordacaoAtiva: { term:'Recordação ativa', article:'recordacao-ativa', alias:'active recall lembrar recuperacao ativa testar',
    short:'Tentar recuperar a informação de memória antes de consultar o material. É o hábito com melhor retorno por minuto.' },
  repeticaoEspacada: { term:'Repetição espaçada', article:'espacamento', alias:'espacamento spaced intervalo distribuir',
    short:'Voltar ao mesmo conteúdo em dias diferentes, com intervalos que crescem, em vez de estudar tudo de uma vez.' },
  modoFoco: { term:'Modo foco', article:'modo-foco', alias:'concentracao tela cheia distracao',
    short:'Uma tela limpa com disciplina, tópico e cronômetro. Esc sai do foco sem encerrar o estudo.' },
  backup: { term:'Backup', article:'backup', alias:'exportar json copia seguranca arquivo',
    short:'Um arquivo .json com todos os seus dados. É o que restaura o Ciclo em outro computador ou depois de limpar o navegador.' },
  indexeddb: { term:'IndexedDB', article:'privacidade', proper:true, alias:'banco dados armazenamento navegador local',
    short:'O espaço de armazenamento que todo navegador moderno oferece. É onde o Ciclo guarda seus dados, no seu computador.' }
};

/* =========================================================================
   ARTIGOS — fonte única. Um artigo por conceito, encontrável pelo título.
   `related` é escrito à mão e nunca é recíproco automaticamente: isso é o
   que impede a navegação em círculo.
   ========================================================================= */
const HELP_ARTICLES = [

/* ---------------------------------------------------------------- USAR · COMEÇANDO */
{
  id:'primeiros-passos', section:'usar', group:'comecando',
  title:'Primeiros passos',
  oneLine:'Em poucos minutos: diga o que você estuda e comece a estudar.',
  summary:'O caminho mais curto entre abrir o Ciclo e começar a estudar.',
  keywords:'inicio começar comecar primeiro uso tutorial introducao novo iniciante nao sei por onde',
  content:[
    { p:'Você não precisa configurar nada antes de estudar. Basta informar uma coisa que você estuda e começar — o resto aparece conforme faz sentido.' },
    { h:'Cinco passos, na ordem que você quiser' },
    { steps:[
      'Adicione algo que você estuda: uma matéria, um idioma, uma certificação, um instrumento.',
      'Comece a estudar. O Ciclo conta o tempo para você.',
      'Adicione tópicos aos poucos, quando quiser acompanhar partes específicas.',
      'O Ciclo avisa quando revisar. Cada tópico estudado volta sozinho no momento certo.',
      'Organize sua semana quando quiser. Dizer quantas horas você tem é opcional e melhora as sugestões.'
    ]},
    { note:'Nada aqui é obrigatório na primeira vez: [[areaEstudo|área]], [[prioridade|prioridade]], [[planoBase|plano semanal]] e [[estrategiaRevisao|o ritmo das revisões]] já vêm com padrões que funcionam.' }
  ],
  cta:{ action:'addDiscipline', label:'Adicionar o que você estuda' },
  related:['estrutura-conteudo','comecar-sessao','o-que-e-revisao']
},
{
  id:'estrutura-conteudo', section:'usar', group:'comecando',
  title:'O que são Área de Estudo, Disciplina e Tópico?',
  oneLine:'Três níveis, do mais amplo ao mais específico. Só a disciplina é obrigatória.',
  summary:'Os três níveis do Ciclo, com exemplos de várias áreas.',
  keywords:'estrutura hierarquia niveis organizar area disciplina topico como organizar meus estudos',
  content:[
    { h:'Como funciona' },
    { ul:[
      'Área de Estudo — reúne disciplinas relacionadas. É opcional e serve só para organizar.',
      'Disciplina — aquilo que você estuda. Tudo o que você registra fica ligado a uma disciplina.',
      'Tópico — uma parte da disciplina. É o tópico que entra nas revisões e mostra o progresso no conteúdo.'
    ]},
    { h:'Exemplo' },
    { tree:{ area:'Tecnologia', discipline:'Redes de Computadores', topics:['OSPF','VLAN'] } },
    { demo:'structure' },
    { h:'O que é obrigatório' },
    { p:'Só a [[disciplina|disciplina]]. Disciplinas sem Área de Estudo aparecem como "Sem área" e funcionam normalmente. Dá para registrar estudos sem tópico algum — você só não terá revisões nem progresso de conteúdo enquanto não criar tópicos.' },
    { h:'No Ciclo' },
    { p:'Em Disciplinas, cada nível abre o próximo, como o índice de um caderno: toque numa área para ver as disciplinas dela e numa disciplina para ver os tópicos. Uma área criada aparece mesmo vazia.' },
    { note:'Área de Estudo não tem prioridade: ela apenas agrupa. Prioridade existe para disciplinas, tópicos e prazos.' }
  ],
  cta:{ action:'openDisciplines', label:'Abrir Disciplinas' },
  related:['disciplinas','topicos','areas-de-estudo']
},
{
  id:'comecar-sessao', section:'usar', group:'comecando',
  title:'Como começar a estudar',
  oneLine:'Clique em Registrar, escolha o que vai estudar e o tempo começa a contar.',
  summary:'Pelo botão Registrar, pelo cronômetro ou pela sugestão da tela Hoje.',
  keywords:'comecar estudar comecar a estudar iniciar sessao registrar estudo botao cronometro agora',
  content:[
    { h:'Como funciona' },
    { p:'O botão Registrar fica sempre visível no canto inferior direito e também responde à tecla R. Ele abre duas opções: "Estudar agora", com o cronômetro, ou "Já estudei", para lançar um estudo que já aconteceu.' },
    { h:'Três caminhos' },
    { ul:[
      'Pela tela Hoje — a sugestão já vem com disciplina e tópico preenchidos.',
      'Pelo botão Registrar — você escolhe livremente a disciplina e o tópico.',
      'Pela tela Revisões — começar uma revisão já abre o cronômetro com um jeito de revisar sugerido.'
    ]},
    { h:'No Ciclo' },
    { p:'Só a disciplina e o tempo são obrigatórios. Tópico, tipo de estudo, [[dificuldade|dificuldade]] e comentário são opcionais e podem ser informados no fim.' }
  ],
  cta:{ action:'quickStart', label:'Começar a estudar agora' },
  related:['cronometro','sessoes','registro-manual']
},

/* ---------------------------------------------------- USAR · ORGANIZANDO MEUS ESTUDOS */
{
  id:'areas-de-estudo', section:'usar', group:'organizando',
  title:'Áreas de Estudo',
  oneLine:'Um jeito opcional de reunir disciplinas relacionadas.',
  summary:'Para quem estuda coisas de contextos diferentes ao mesmo tempo.',
  keywords:'area de estudo areas criar agrupar organizar contexto opcional sem area',
  content:[
    { h:'Como funciona' },
    { p:'A [[areaEstudo]] só organiza. Ela ajuda quando você estuda coisas de contextos diferentes ao mesmo tempo — faculdade e um idioma, por exemplo — e quer ver cada conjunto separado nas Análises.' },
    { h:'Exemplo' },
    { ul:['Faculdade — Direito Penal, Direito Civil, Processo Penal','Idiomas — Inglês, Espanhol','Música — Violão, Teoria musical'] },
    { h:'Como criar' },
    { steps:[
      'Abra Disciplinas.',
      'Clique em "Adicionar" e escolha "Nova área de estudo".',
      'Dê um nome curto.',
      'Se quiser, traga disciplinas para ela. Dá para mudar depois.'
    ]},
    { p:'A área aparece na hora, mesmo vazia. Abra a área para adicionar disciplinas; em "Mais", você renomeia, escolhe disciplinas, arquiva ou exclui.' },
    { p:'Também dá para criar uma área no próprio formulário da disciplina: em "Onde quer organizar?", escolha "+ Criar nova área".' },
    { note:'Excluir uma área não apaga nada: as disciplinas dela voltam para "Sem área". Arquivar uma área arquiva junto as disciplinas dela, com todo o histórico preservado.' }
  ],
  cta:{ action:'addArea', label:'Criar uma Área de Estudo' },
  related:['disciplinas','topicos']
},
{
  id:'disciplinas', section:'usar', group:'organizando',
  title:'Disciplinas',
  oneLine:'A principal coisa que você estuda. Tudo o que você registra fica ligado a uma.',
  summary:'Criar, editar, arquivar e o que cada campo significa.',
  keywords:'disciplina materia criar adicionar editar arquivar excluir nome creditos natureza tipo de conteudo',
  content:[
    { h:'Como funciona' },
    { p:'Uma [[disciplina|disciplina]] é o que você estuda: uma matéria, um idioma, um instrumento, uma certificação. Só o nome é obrigatório.' },
    { h:'Exemplo' },
    { ul:['Matemática','Inglês','Anatomia','Direito Penal','Redes de Computadores','Violão'] },
    { h:'Como criar' },
    { steps:[
      'Abra Disciplinas.',
      'Clique em "Adicionar" → "Nova disciplina" (dentro de uma área, use "Adicionar disciplina").',
      'Digite o nome.',
      'Se quiser, escolha onde organizar e a prioridade. A prioridade começa em 3 — Média.'
    ]},
    { details:{ title:'Mais opções da disciplina', content:[
      { ul:[
        'Minutos por crédito — quantos minutos valem 1 [[credito|crédito]] nessa disciplina. O padrão é 20.',
        'Tipo de conteúdo — se a disciplina é mais conceitual, de memorização, de resolução de problemas ou prática. Ajuda o Ciclo a sugerir como revisar.',
        'Quando revisar — o ritmo das revisões. Vale para os tópicos da disciplina, a menos que um tópico tenha o seu próprio.'
      ]}
    ]}},
    { h:'Arquivar em vez de excluir' },
    { p:'Arquivar tira a disciplina do uso ativo — planejamento, recomendações e revisões — e preserva todo o histórico. A exclusão definitiva apaga junto os estudos registrados e por isso fica como ação secundária.' }
  ],
  cta:{ action:'addDiscipline', label:'Adicionar uma disciplina' },
  related:['topicos','prioridades','creditos']
},
{
  id:'topicos', section:'usar', group:'organizando',
  title:'Tópicos',
  oneLine:'Uma parte de uma disciplina. É o tópico que entra nas revisões.',
  summary:'Como adicionar, quando vale a pena e o que muda quando existem tópicos.',
  keywords:'topico topicos adicionar varios criar parte conteudo capitulo revisao',
  content:[
    { h:'Como funciona' },
    { p:'Tópicos dividem a disciplina em partes. Não são obrigatórios, mas são eles que permitem ao Ciclo agendar [[revisao|revisões]], mostrar o [[cobertura|conteúdo estudado]] e acompanhar a [[dominio|consolidação]] de cada conteúdo.' },
    { h:'Exemplo' },
    { ul:['Matemática → Derivadas','Inglês → Present Perfect','História → Era Vargas','Anatomia → Sistema cardiovascular','Violão → Formação de acordes'] },
    { h:'Como adicionar' },
    { steps:[
      'Abra a disciplina.',
      'Escreva o nome no campo "Nome do novo tópico".',
      'Clique em "Adicionar tópico" ou pressione Enter.',
      'Confirme o nome, a prioridade e se o tópico entra nas revisões.'
    ]},
    { note:'Para colar vários de uma vez, um por linha, use "Adicionar vários de uma vez".' },
    { h:'No Ciclo' },
    { p:'Não precisa cadastrar tudo de uma vez. Adicionar tópicos aos poucos, conforme você estuda, costuma funcionar melhor do que transcrever uma ementa inteira antes de começar.' }
  ],
  cta:{ action:'addTopic', label:'Adicionar um tópico' },
  related:['prioridade-topico','o-que-e-revisao','dominio']
},
{
  id:'prioridades', section:'usar', group:'organizando',
  title:'Prioridades',
  oneLine:'Prioridade indica quanto algo merece sua atenção neste momento.',
  summary:'Uma escala de 1 a 5 para disciplinas, tópicos e prazos.',
  keywords:'prioridade escala 1 5 muito baixa media mediana alta peso importancia disciplina topico prazo barrinhas',
  content:[
    { h:'Como funciona' },
    { p:'O Ciclo usa a [[prioridade|prioridade]] para distribuir o tempo da semana, ordenar recomendações e organizar as revisões. A escala é a mesma em todo lugar:' },
    { ul:['1 — Muito baixa','2 — Baixa','3 — Média (o padrão)','4 — Alta','5 — Muito alta'] },
    { p:'Em todo o Ciclo, a prioridade aparece com o mesmo símbolo: cinco barrinhas em escada. Quantas estão preenchidas é o nível — uma barrinha é muito baixa, cinco é muito alta.' },
    { h:'Exemplo' },
    { tree:{ area:'Tecnologia', discipline:'Redes de Computadores', priority:5,
             topics:[{ name:'Subnetting', priority:5 }, { name:'VLAN', priority:4 }, { name:'OSPF', priority:2 }] } },
    { p:'Redes continua sendo uma disciplina importante, mas dentro dela Subnetting merece mais atenção que OSPF.' },
    { demo:'priority' },
    { details:{ title:'O que cada nível de prioridade muda', content:[
      { ul:[
        'Na disciplina — quanto tempo ela recebe no plano semanal e o peso dela nas sugestões da tela Hoje.',
        'No tópico — a ordem dentro da disciplina, principalmente na fila de revisões, e um pequeno ajuste no intervalo.',
        'No prazo — quanto ele pesa quando a data se aproxima.'
      ]},
      { p:'A diferença entre os níveis é real, mas não é absurda: com 5 horas por semana, disciplinas de prioridade baixa continuam recebendo sua parte.' }
    ]}},
    { h:'No Ciclo' },
    { p:'Você muda a prioridade direto na página da disciplina ou do tópico, clicando nas barrinhas, ou ao editar um prazo. Se tudo for 5, nada se destaca — use prioridade alta para o que realmente merece e deixe o resto em 3.' }
  ],
  cta:{ action:'editPriority', label:'Alterar uma prioridade agora' },
  related:['prioridade-topico','distribuicao','prazos']
},
{
  id:'prioridade-topico', section:'usar', group:'organizando',
  title:'Prioridade do tópico',
  oneLine:'Organiza a ordem dentro da disciplina — não é a prioridade da disciplina.',
  summary:'O que muda quando um tópico é mais prioritário que outro.',
  keywords:'prioridade topico ordem fila revisao diferenca disciplina importancia antiga',
  content:[
    { h:'Como funciona' },
    { p:'Disciplina e tópico têm prioridades separadas, na mesma escala de 1 a 5. A da disciplina decide quanto tempo ela recebe na semana; a do tópico decide a ordem dentro dela.' },
    { h:'O que a prioridade do tópico muda' },
    { ul:[
      'Tópicos mais prioritários aparecem antes na fila de revisões e nas sugestões.',
      'As revisões ficam um pouco mais próximas (4 e 5) ou um pouco mais espaçadas (1 e 2).',
      'A estimativa de tempo de revisão fica levemente maior para tópicos 4 e 5.'
    ]},
    { h:'Exemplo' },
    { p:'Em Redes de Computadores (prioridade 4), OSPF pode ser 5 porque cai muito na prova, enquanto História da Internet pode ficar em 2.' },
    { note:'Seu resultado nas revisões continua pesando mais: um tópico 5 que você domina ainda ganha intervalos maiores, e um tópico 2 que você esquece volta logo.' },
    { p:'Tópicos criados em versões anteriores foram convertidos automaticamente: importância baixa virou 2, normal virou 3 e alta virou 4. Nenhuma revisão foi reagendada.' }
  ],
  related:['fila-revisao','prazos']
},
{
  id:'prazos', section:'usar', group:'organizando',
  title:'Prazos',
  oneLine:'Uma data importante que faz o Ciclo dar mais atenção a um conteúdo.',
  summary:'Provas, trabalhos, projetos e entregas ligados ao que você estuda.',
  keywords:'prazo prova trabalho projeto entrega tarefa data vencimento criar prazo como criar um prazo',
  content:[
    { h:'Como funciona' },
    { p:'Um [[prazo|prazo]] é uma data que importa para os seus estudos. Ao ligá-lo a uma disciplina — e, se quiser, a um tópico dela — o Ciclo passa a dar mais atenção a esse conteúdo conforme a data se aproxima.' },
    { h:'Como criar' },
    { steps:[
      'Abra Disciplinas e vá até Prazos (ou use a busca com Ctrl + K).',
      'Clique em "+ Prazo".',
      'Escolha o tipo, escreva o título e informe a data.',
      'Se quiser, ligue a uma disciplina e a um tópico, e defina a prioridade.'
    ]},
    { h:'Exemplo' },
    { ul:[
      'Prova · P2 de Cálculo · 30/09 · prioridade 5',
      'Entrega · Relatório de laboratório · 12/10 · tópico VLAN',
      'Projeto · TCC · entrega em dezembro, começa a pesar em outubro'
    ]},
    { details:{ title:'Os campos opcionais do prazo', content:[
      { ul:[
        'Data de início — a partir de quando o prazo começa a pesar. Útil para trabalhos longos.',
        'Orientações — o que foi pedido: enunciado, critérios, capítulos da prova.',
        'Anotações — suas observações pessoais: o que já fez, dúvidas, lembretes.',
        'Status — pendente, em andamento ou concluído.'
      ]},
      { p:'Orientações e anotações ficam só no seu navegador e não entram no relatório das Análises.' }
    ]}},
    { h:'No Ciclo' },
    { p:'Concluir um prazo não apaga nada: ele sai das sugestões e continua no histórico, em "Concluídos".' }
  ],
  cta:{ action:'addDeadline', label:'Adicionar um prazo' },
  related:['prazos-influencia']
},
{
  id:'prazos-influencia', section:'usar', group:'organizando',
  title:'Como um prazo influencia as sugestões',
  oneLine:'Proximidade da data × prioridade do prazo.',
  summary:'Quanto um prazo pesa, e quando ele deixa de pesar.',
  keywords:'prazo influencia peso urgencia proximidade prioridade recomendacao revisao planejamento',
  content:[
    { h:'Como funciona' },
    { p:'Quanto mais perto a data e maior a prioridade, mais o prazo pesa. Um prazo daqui a três meses quase não muda nada; na última semana, pesa bastante.' },
    { ul:[
      'Na tela Hoje, a disciplina do prazo sobe nas sugestões e o motivo aparece em texto ("Prova de Cálculo em 5 dias").',
      'No plano semanal, ela recebe um pouco mais de tempo enquanto o prazo está próximo.',
      'Na fila de revisões, os tópicos do prazo sobem de posição. Se o prazo é de um tópico específico, a próxima revisão dele é marcada antes da data.'
    ]},
    { h:'Quando um prazo não influencia' },
    { ul:['Depois de concluído.','Antes da data de início, se você informou uma.','Depois que a data passou — ele continua visível como "venceu", para você decidir o que fazer.'] },
    { note:'Prazo de um tópico dá destaque só a esse tópico. Prazo da disciplina inteira ajuda todos os tópicos dela, com metade da força.' }
  ],
  related:['como-o-ciclo-sugere','fila-revisao']
},

/* --------------------------------------------------------------- USAR · ESTUDANDO */
{
  id:'sessoes', section:'usar', group:'estudando',
  title:'Registrar um estudo',
  oneLine:'Cada vez que você estuda e registra, o Ciclo guarda esse estudo.',
  summary:'O dado mais importante do Ciclo: o que ele guarda e para que serve.',
  keywords:'sessao sessoes bloco estudo registro registrar tempo minutos comentario o que e uma sessao',
  content:[
    { h:'Como funciona' },
    { p:'Um [[sessao|estudo registrado]] é qualquer período em que você estudou algo e anotou no Ciclo. Pode ter 10 minutos ou duas horas. Ele guarda a disciplina, o tempo e — se você quiser — o tópico, o tipo, a dificuldade e um comentário.' },
    { h:'Exemplo' },
    { ul:['Inglês · 20 min','Cálculo · Derivadas · 40 min · exercícios · difícil','Redes de Computadores · VLAN · 1h · laboratório'] },
    { h:'Por que registrar' },
    { p:'Registrar transforma sensação em informação. Os registros alimentam o planejamento, as análises e as revisões: sem eles, o Ciclo não tem como sugerir nada.' },
    { details:{ title:'Tipos de estudo', content:[
      { p:'Classificar é opcional, mas alimenta uma análise útil: a proporção entre teoria e prática.' },
      { ul:[
        'Teoria — leitura, videoaula, explicação.',
        'Exercícios — questões, listas, simulados.',
        'Laboratório — prática aplicada, experimentos, montagem.',
        'Revisão — retomar conteúdo já estudado.',
        'Projeto — trabalho maior e contínuo.',
        'Outro — o que não se encaixa acima.'
      ]},
      { p:'Se você marcar o tipo como Revisão e o estudo tiver um tópico, o Ciclo pergunta como você se saiu e ajusta o intervalo da próxima revisão.' }
    ]}}
  ],
  cta:{ action:'openHistory', label:'Ver meus estudos' },
  related:['cronometro','registro-manual','dificuldade']
},
{
  id:'cronometro', section:'usar', group:'estudando',
  title:'Cronômetro',
  oneLine:'Ele continua correndo mesmo se você recarregar ou fechar a aba.',
  summary:'Pausar, retomar, entrar no modo foco e finalizar.',
  keywords:'cronometro timer tempo pausar retomar finalizar contador aba fechou',
  content:[
    { h:'Como funciona' },
    { p:'Com um cronômetro ativo, aparece uma barra no topo com a disciplina, o tópico e o tempo. Dali você pode pausar, retomar, entrar no [[modoFoco|modo foco]] ou finalizar.' },
    { h:'Ele sobrevive a fechar a aba' },
    { p:'O tempo é calculado por marcação de horário, não por um contador que roda na tela. Se você recarregar a página, fechar e reabrir o navegador, o cronômetro volta com o tempo correto.' },
    { h:'Cronômetro esquecido' },
    { p:'Se você voltar e o cronômetro estiver ligado há muitas horas, o Ciclo pergunta o que fazer em vez de registrar tudo automaticamente. Ao finalizar, a duração pode ser corrigida antes de salvar.' }
  ],
  related:['modo-foco','registro-manual']
},
{
  id:'modo-foco', section:'usar', group:'estudando',
  title:'Modo foco',
  oneLine:'Uma tela limpa com disciplina, tópico e cronômetro — nada mais.',
  summary:'Para quando o resto da interface atrapalha.',
  keywords:'modo foco concentracao tela cheia distracao esc sair',
  content:[
    { h:'Como funciona' },
    { p:'No computador, o [[modoFoco|modo foco]] esconde o resto da interface e deixa só o essencial. Ele é um estado visual do próprio Ciclo: não abre tela cheia do navegador nem bloqueia nada.' },
    { h:'No Ciclo' },
    { ul:[
      'Você entra pela barra do cronômetro ou pela busca de comandos (Ctrl + K).',
      'Esc sai do foco sem encerrar o estudo.',
      'Pausar, retomar e finalizar continuam disponíveis dentro do foco.'
    ]}
  ],
  related:['pomodoro-guia','sessoes-longas']
},
{
  id:'registro-manual', section:'usar', group:'estudando',
  title:'Registro manual',
  oneLine:'Para lançar um estudo que já aconteceu.',
  summary:'Data e minutos, inclusive de dias anteriores.',
  keywords:'manual retroativo passado esqueci lancar data minutos ontem',
  content:[
    { h:'Como funciona' },
    { p:'No botão Registrar, escolha "Já estudei". Você informa disciplina, tópico, data e minutos.' },
    { h:'No Ciclo' },
    { p:'A data pode ser anterior a hoje, o que é útil para recuperar estudos que não foram lançados na hora. Os [[credito|créditos]] são calculados a partir dos minutos, usando a regra da disciplina.' },
    { note:'Editar um estudo no Histórico recalcula os créditos pela regra atual da disciplina.' }
  ],
  cta:{ action:'openHistory', label:'Abrir Histórico' },
  related:['dificuldade','creditos']
},
{
  id:'dificuldade', section:'usar', group:'estudando',
  title:'Dificuldade percebida',
  oneLine:'Quanto aquele estudo pareceu difícil para você, de 1 a 5.',
  summary:'É opcional, é só para análise e não altera nada nas revisões.',
  keywords:'dificuldade percebida esforco nivel facil dificil 1 5 diferenca dominio',
  content:[
    { h:'Como funciona' },
    { p:'A [[dificuldade|dificuldade]] vai de "Muito fácil" (1) a "Muito difícil" (5) e registra como aquele estudo pareceu para você, na hora. É opcional.' },
    { h:'O que ela não faz' },
    { p:'Ela é puramente analítica: não altera créditos, não altera o planejamento e não altera o intervalo das revisões. Serve para você enxergar depois quais conteúdos estão custando mais esforço.' },
    { h:'Dificuldade não é consolidação' },
    { p:'Dificuldade é a sua percepção no momento do estudo. [[dominio|Consolidação]] vem do resultado das revisões ao longo do tempo. Um conteúdo pode ser difícil e mesmo assim estar bem consolidado — e o contrário também acontece.' }
  ],
  related:['dominio','analises-como-ler']
},

/* ------------------------------------------------- USAR · ORGANIZANDO MINHA SEMANA */
{
  id:'planejamento', section:'usar', group:'semana',
  title:'Planejamento semanal',
  oneLine:'Você diz quanto tempo tem; o Ciclo distribui entre as disciplinas.',
  summary:'Opcional, flexível e sempre editável.',
  keywords:'planejamento plano semanal horas disponibilidade organizar semana distribuir tempo',
  content:[
    { h:'Como funciona' },
    { p:'Em Planejamento você informa a sua [[disponibilidade|disponibilidade semanal]]: quantas horas por semana pretende estudar. O Ciclo distribui esse tempo entre as disciplinas ativas e você pode editar qualquer valor.' },
    { demo:'plan' },
    { h:'Como montar um bom plano' },
    { ul:[
      'Comece com um número que você cumpre numa semana comum, não no seu melhor cenário.',
      'Use prioridade máxima só para o que realmente merece. Se tudo é 5, nada é prioritário.',
      'Use mínimos semanais para o que você não quer negligenciar, mesmo com prioridade menor.',
      'Ajuste o plano quando a realidade mudar — provas, semanas cheias, férias.'
    ]},
    { h:'Por que não é uma agenda rígida' },
    { p:'O Ciclo controla quanto falta na semana, não em que dia você estuda. Não estudar na terça não quebra nada: a recomendação apenas passa a puxar essa disciplina com mais força enquanto o tempo não for cumprido.' },
    { note:'O planejamento é opcional. Sem ele, o Ciclo continua sugerindo o que estudar — só com menos informação.' }
  ],
  cta:{ action:'plan', label:'Organizar minha semana' },
  related:['distribuicao','plano-base','planejado-realizado']
},
{
  id:'distribuicao', section:'usar', group:'semana',
  title:'Como o tempo é distribuído',
  oneLine:'Primeiro os mínimos, depois a divisão por prioridade.',
  summary:'A sequência do botão "Distribuir automaticamente" e o papel dos mínimos.',
  keywords:'distribuicao automatica calculo dividir tempo minimo semanal piso arredondar',
  content:[
    { h:'Como funciona' },
    { p:'O botão "Distribuir automaticamente" segue sempre a mesma sequência:' },
    { ol:[
      'Reserva o [[minimoSemanal|mínimo semanal]] de cada disciplina.',
      'Divide o tempo restante segundo a prioridade — prioridades altas recebem um peso bem maior.',
      'Aumenta o peso de disciplinas com prazo próximo.',
      'Arredonda em blocos de 5 minutos e corrige a sobra para fechar exatamente na sua disponibilidade.'
    ]},
    { h:'Mínimos semanais' },
    { p:'O mínimo é reservado antes de qualquer outra conta. Ele existe para conteúdos que você não quer deixar de lado, mesmo que não sejam a maior prioridade.' },
    { note:'Se a soma dos mínimos passar da sua disponibilidade, o Ciclo avisa e mostra o excesso em vez de reduzir tudo em silêncio. Você decide se ajusta os mínimos ou aumenta a disponibilidade.' },
    { h:'No Ciclo' },
    { p:'O resultado é uma sugestão: todos os valores continuam editáveis à mão, e o total é recalculado enquanto você digita.' }
  ],
  cta:{ action:'plan', label:'Abrir Planejamento' },
  related:['plano-base','planejado-realizado']
},
{
  id:'plano-base', section:'usar', group:'semana',
  title:'Plano semanal e semana atual',
  oneLine:'O plano é o modelo; cada semana guarda uma cópia do que valia nela.',
  summary:'Cada semana guarda o plano que valia nela.',
  keywords:'plano base semana atual historico snapshot alterar proxima semana',
  content:[
    { h:'Como funciona' },
    { p:'O [[planoBase|plano semanal]] é o modelo. Toda semana recebe uma cópia própria dele no momento em que começa.' },
    { h:'Exemplo' },
    { ul:[
      'Em março seu plano era: Matemática 2h, Inglês 1h.',
      'Em abril você mudou para: Matemática 3h, Inglês 30min.',
      'As análises de março continuam comparando com 2h e 1h — o plano que realmente valia lá.'
    ]},
    { h:'No Ciclo' },
    { p:'Ao salvar, você escolhe entre valer a partir da próxima semana ou aplicar também na semana atual. Alterar o plano hoje nunca reescreve as metas de semanas anteriores.' }
  ],
  related:['planejado-realizado','analises']
},
{
  id:'planejado-realizado', section:'usar', group:'semana',
  title:'Planejado × realizado',
  oneLine:'"Plano cumprido" é quanto do tempo planejado foi de fato estudado.',
  summary:'Como a comparação é feita e por que passar de 100% não é sempre melhor.',
  keywords:'planejado realizado aderencia plano cumprido porcentagem meta comparacao',
  content:[
    { h:'Como funciona' },
    { p:'[[aderencia|Plano cumprido]] de 100% significa que você cumpriu exatamente o previsto; acima disso significa que estudou mais. A comparação usa o plano histórico de cada semana tocada pelo período.' },
    { h:'Exemplo' },
    { p:'Se o período cobre apenas três dias de uma semana, o planejado daquela semana entra proporcionalmente a esses três dias.' },
    { note:'Passar de 100% não é automaticamente melhor — pode significar que outra disciplina ficou para trás. Por isso a análise mostra também o desempenho por disciplina.' }
  ],
  cta:{ action:'openAnalytics', label:'Abrir Análises' },
  related:['analises-como-ler','consistencia-guia']
},

/* -------------------------------------------------------------- USAR · REVISANDO */
{
  id:'o-que-e-revisao', section:'usar', group:'revisando',
  title:'O que é uma revisão?',
  oneLine:'Você estudou isso antes. Agora vamos ver o que ainda consegue lembrar.',
  summary:'Como um tópico entra no ciclo e o que acontece quando ele volta.',
  keywords:'revisao revisar rever o que e como funcionam as revisoes ciclo espacada automatica',
  content:[
    { h:'Como funciona' },
    { p:'Quando você estuda um tópico pela primeira vez, ele entra no ciclo automaticamente: a primeira revisão fica marcada para o dia seguinte, com [[dominio|consolidação]] inicial 2 de 5. Na revisão, você tenta lembrar antes de consultar e depois diz como foi.' },
    { demo:'review' },
    { h:'No Ciclo' },
    { p:'Você vê algo simples, como "Você tem 2 revisões hoje". O Ciclo cuida das datas, sugere um jeito de revisar e mostra um roteiro curto.' },
    { note:'Estudos comuns em um tópico já cadastrado não reprogramam nada — só o resultado de uma revisão altera o ciclo.' }
  ],
  cta:{ action:'openReviews', label:'Abrir Revisões' },
  related:['quando-revisar','metodos-revisao','resultados-revisao']
},
{
  id:'quando-revisar', section:'usar', group:'revisando',
  title:'Quando revisar?',
  oneLine:'O Ciclo decide quantos dias esperar até a próxima revisão.',
  summary:'Adaptativa, ciclo programado, intensiva e manutenção.',
  keywords:'quando revisar estrategia adaptativa ciclo programado intensiva manutencao intervalo dias',
  content:[
    { h:'Como funciona' },
    { p:'[[estrategiaRevisao|Quando revisar]] responde a uma única pergunta: em quantos dias este conteúdo deve voltar. Não diz como revisar — isso é outra escolha.' },
    { h:'Adaptativa (padrão)' },
    { p:'O [[intervaloRevisao|tempo até a próxima revisão]] acompanha o seu resultado. Lembrou bem, o intervalo cresce; esqueceu, ele volta para o dia seguinte. É a escolha certa para quase todo mundo.' },
    { details:{ title:'Os outros três ritmos', content:[
      { ul:[
        'Ciclo programado — intervalos previsíveis: 1, 3, 7, 14, 30 e 60 dias. O resultado move você dentro do ciclo.',
        'Intensiva — intervalos curtos (1, 2, 3, 5, 7, 10, 14 dias) para períodos de prova. Quando o prazo passa, o Ciclo avisa e sugere voltar ao ritmo normal.',
        'Manutenção — intervalos longos (14 a 180 dias) para conteúdo já consolidado que você só quer manter acessível.'
      ]},
      { p:'O ritmo pode ser definido em Configurações (vale para tudo), na disciplina ou em um tópico específico, sempre em "Quando revisar". O nível mais específico vence. O intervalo máximo é de 180 dias.' }
    ]}},
    { h:'No Ciclo' },
    { p:'Você não precisa escolher nada: sem mexer em nada, tudo usa a adaptativa.' }
  ],
  related:['metodos-revisao','resultados-revisao','espacamento']
},
{
  id:'metodos-revisao', section:'usar', group:'revisando',
  title:'Como revisar',
  oneLine:'Revisar não é reler. "Como revisar" decide o que você faz nos minutos da revisão.',
  summary:'Sete formas de trabalhar o conteúdo, e como o Ciclo escolhe uma.',
  keywords:'metodo como revisar recordacao ativa exercicios explicacao resumo flashcards intercalada livre automatico',
  content:[
    { h:'Como funciona' },
    { p:'[[metodoRevisao|Como revisar]] responde a outra pergunta: o que fazer durante a revisão. O Ciclo sugere um jeito, mostra um roteiro curto e deixa você trocar quando quiser.' },
    { ul:[
      'Recordação ativa — feche o material e tente lembrar antes de conferir.',
      'Exercícios — resolva questões antes de olhar a resposta.',
      'Explicação — explique com palavras simples, como se ensinasse alguém.',
      'Resumo de memória — escreva o que lembra e só depois compare.',
      'Flashcards — pergunta de um lado, resposta do outro.',
      'Prática intercalada — misture tipos de problema em vez de repetir só um.',
      'Revisão livre — você decide a abordagem.'
    ]},
    { h:'No automático' },
    { p:'No modo Automático, o Ciclo escolhe a partir do [[naturezaConteudo|tipo de conteúdo]] da disciplina: conteúdo conceitual tende a recordação ativa e explicação; memorização, a recordação ativa e flashcards; resolução de problemas, a exercícios e prática intercalada. Se a última revisão foi "esqueci", ele prefere recordação ativa.' },
    { note:'A sugestão é sempre explicada na tela e nunca impede você de escolher outra coisa.' }
  ],
  related:['fila-revisao','recordacao-ativa','revisao-nao-e-reler']
},
{
  id:'fila-revisao', section:'usar', group:'revisando',
  title:'Como o Ciclo escolhe uma revisão',
  oneLine:'A fila é ordenada por relevância, não apenas por data.',
  summary:'O que sobe um item na fila, e o que fazer quando ela acumula.',
  keywords:'fila ordem revisao atrasada backlog acumulo montar sessao escolher 30 revisoes',
  content:[
    { h:'Como funciona' },
    { p:'A fila considera vários sinais ao mesmo tempo: há quantos dias a revisão está atrasada, a [[prioridade|prioridade]] do tópico (e, com menos peso, a da disciplina), a [[dominio|consolidação]] atual, o resultado da última revisão, quantas vezes você já esqueceu aquele conteúdo, prazos próximos e há quanto tempo você não revisa.' },
    { h:'Exemplo' },
    { p:'Cada item mostra os motivos em texto — "atrasada há 4 dias", "prioridade alta", "Prova de Cálculo em 5 dias". O cálculo interno nunca aparece, porque o número não ajudaria você a decidir nada.' },
    { h:'Quando a fila acumula' },
    { p:'Ter 30 revisões pendentes não significa que você precisa fazer 30 hoje. Use "Revisar por 20 min" ou "Escolher tempo", informe quanto tempo você tem, e o Ciclo seleciona os itens mais relevantes que cabem nesse tempo. O restante continua na fila, sem nada ser marcado como concluído.' }
  ],
  cta:{ action:'openReviews', label:'Abrir Revisões' },
  related:['resultados-revisao','dominio','desativar-revisao']
},
{
  id:'resultados-revisao', section:'usar', group:'revisando',
  title:'Esqueci, Lembrei com dificuldade, Lembrei bem, Dominei',
  oneLine:'Sua resposta decide quando o tópico volta.',
  summary:'O que cada resposta faz com a próxima data e com a consolidação.',
  keywords:'esqueci dificuldade lembrei bem dominei resultado revisao intervalo honestidade',
  content:[
    { h:'Como funciona' },
    { ul:[
      'Esqueci — a próxima revisão volta para amanhã e a consolidação cai 2 pontos.',
      'Lembrei com dificuldade — o intervalo cresce pouco (metade a mais, no mínimo 2 dias) e a consolidação cai 1 ponto.',
      'Lembrei bem — o intervalo mais que dobra (no mínimo 4 dias) e a consolidação sobe 1 ponto.',
      'Dominei — o intervalo cresce bastante (no mínimo 7 dias) e a consolidação vai direto para 5.'
    ]},
    { p:'"Esqueci" e "Lembrei com dificuldade" também zeram a sequência de acertos seguidos.' },
    { note:'Responder com honestidade é o que faz o sistema trabalhar a seu favor. Marcar "Dominei" sem ter dominado só adia o problema.' }
  ],
  related:['dominio','desativar-revisao']
},
{
  id:'dominio', section:'usar', group:'revisando',
  title:'O que é consolidação?',
  oneLine:'Uma estimativa de quanto um tópico já está firme na sua memória.',
  summary:'De 1 a 5, calculado a partir dos resultados das suas revisões.',
  keywords:'consolidacao consolidado dominio dominado status topico nao iniciado em estudo em revisao consolidado retencao',
  content:[
    { h:'Como funciona' },
    { p:'A [[dominio|consolidação]] começa em 2, sobe quando você lembra e cai quando você esquece. Ela é uma estimativa a partir do seu histórico de revisões — não é uma medição exata do que está na sua cabeça.' },
    { h:'Exemplo' },
    { ul:['OSPF · consolidação 2 de 5 — "Você teve dificuldade nas últimas revisões."','Present Perfect · consolidação 5 de 5 — "As últimas revisões foram bem."'] },
    { h:'Quando um tópico é considerado dominado' },
    { p:'Consolidação 4 ou 5 e pelo menos duas revisões seguidas bem-sucedidas. O status é sempre calculado do histórico, nunca definido à mão:' },
    { ul:[
      'Não iniciado — nenhum estudo registrado.',
      'Em estudo — já estudado, mas ainda sem nenhuma revisão concluída.',
      'Em revisão — já tem histórico de revisão, mas ainda não atingiu o critério.',
      'Dominado — consolidação 4 ou 5 e duas revisões seguidas bem-sucedidas.'
    ]},
    { note:'Um tópico dominado pode voltar para "em revisão" se você esquecer depois. Isso é esperado: o status reflete a situação atual, não uma conquista permanente.' }
  ],
  related:['cobertura-dominio','analises-observacoes']
},
{
  id:'desativar-revisao', section:'usar', group:'revisando',
  title:'Posso desativar a revisão de um tópico?',
  oneLine:'Sim, por tópico ou para todos os novos.',
  summary:'Como tirar um conteúdo do ciclo sem perder o histórico.',
  keywords:'desativar desligar revisao topico automatica pausar parar arquivar',
  content:[
    { h:'Como funciona' },
    { p:'Ao editar um tópico, existe a opção "Incluir nas revisões". Desmarcando, ele deixa de gerar revisões, mas continua acumulando estudos e tempo normalmente.' },
    { h:'No Ciclo' },
    { ul:[
      'Em Configurações → Revisões você desliga a inclusão automática de novos tópicos.',
      'Arquivar um tópico também pausa as revisões dele, preservando todo o histórico.'
    ]}
  ],
  cta:{ action:'openSettings', label:'Abrir Configurações' },
  related:['cobertura-dominio']
},

/* ------------------------------------------------ USAR · ENTENDENDO MEU PROGRESSO */
{
  id:'analises', section:'usar', group:'progresso',
  title:'Análises: escolher o que entender',
  oneLine:'Primeiro você escolhe; depois o Ciclo monta só a análise relevante.',
  summary:'As três escolhas — o que analisar, qual período e o que ver — e a diferença entre os períodos.',
  keywords:'analises analise periodo escopo filtro o que analisar hoje semana mes personalizado foco gerar alterar',
  content:[
    { h:'Como funciona' },
    { p:'Análises começa com uma pergunta: o que você quer entender? Você responde três coisas e clica em "Gerar análise".' },
    { steps:[
      'O que analisar: todos os estudos, uma Área de Estudo, uma disciplina ou um tópico. É o [[escopo|escopo]].',
      'Qual período: esta semana, últimos 7 dias, este mês, últimos 30 dias, tudo — ou datas que você escolhe.',
      'O que ver: visão geral, tempo e constância, planejamento, revisões, conteúdo ou prazos.'
    ]},
    { h:'Diferença entre os períodos' },
    { ul:[
      'Esta semana e Este mês cobrem o período inteiro, inclusive os dias que ainda vão chegar.',
      'Últimos 7 e 30 dias terminam hoje.',
      'Tudo começa no primeiro estudo registrado.',
      'Personalizado: escolha o primeiro dia e depois o último, no calendário ou nos campos de data.'
    ]},
    { h:'Exemplo' },
    { p:'Redes de Computadores · Últimos 30 dias · Revisões mostra só as revisões dessa disciplina nesse período: quantas foram feitas, como foram e o que está atrasado.' },
    { note:'Algumas combinações não fazem sentido e ficam indisponíveis com a explicação ao lado — por exemplo, Planejamento para um tópico, porque o plano semanal é por disciplina.' }
  ],
  cta:{ action:'openAnalytics', label:'Abrir Análises' },
  related:['analises-como-ler','calendario','relatorio']
},
{
  id:'analises-como-ler', section:'usar', group:'progresso',
  title:'Como ler uma análise',
  oneLine:'Resumo, poucos números, um gráfico e os principais insights. O resto, se você quiser.',
  summary:'A ordem do resultado e onde ficam os detalhes.',
  keywords:'analises ler entender resumo numeros detalhes insights explorar graficos alterar exportar',
  content:[
    { h:'A ordem do resultado' },
    { ul:[
      'No topo, o que está sendo analisado, o período e o foco. "Alterar análise" volta às escolhas, já preenchidas; "Cancelar" mantém o resultado anterior.',
      'Seu período em resumo — poucas frases com o que aconteceu.',
      'Três ou quatro números essenciais. Os que têm seta abrem os detalhes.',
      'Um gráfico principal, escolhido conforme o foco.',
      'Principais insights — pontos de atenção e pontos positivos, sem julgamento.'
    ]},
    { h:'Explorar mais' },
    { p:'No fim da página ficam as outras visões — calendário, distribuição do tempo, semana a semana, prioridades, dificuldade e mais. Cada uma abre só quando você clicar. Nos gráficos, clique numa linha ou barra para ver mais e, quando fizer sentido, analisar só aquele item.' },
    { note:'Tudo funciona pelo teclado: Tab navega, as setas escolhem opções, Enter abre, Esc fecha os detalhes.' }
  ],
  related:['calendario','analises-observacoes','relatorio']
},
{
  id:'calendario', section:'usar', group:'progresso',
  title:'Calendário',
  oneLine:'Ver um dia ou escolher um intervalo.',
  summary:'Cada quadrado é um dia; a barrinha mostra quanto você estudou.',
  keywords:'calendario heatmap mapa dias consistencia intervalo selecionar dia periodo',
  content:[
    { h:'Como funciona' },
    { p:'O calendário fica em Análises → Explorar mais. Cada quadrado é um dia. A barrinha colorida mostra quanto você estudou nele, comparado com o dia mais intenso do mês. O pontinho indica um prazo. Ele respeita o que está sendo analisado: com uma disciplina escolhida, mostra só o tempo dela.' },
    { h:'Ver um dia' },
    { p:'Clique em um dia para ver o que foi estudado nele. No painel, "Analisar este dia" muda o período da página para aquele dia.' },
    { h:'Escolher um intervalo' },
    { steps:[
      'Clique em "Selecionar intervalo".',
      'Clique no primeiro e no último dia (a ordem não importa).',
      'Confira as datas e clique em "Analisar este período".'
    ]},
    { note:'Pelo teclado: as setas movem entre os dias, Page Up e Page Down trocam de mês, Enter escolhe.' }
  ],
  related:['analises-observacoes','consistencia-guia']
},
{
  id:'cobertura-dominio', section:'usar', group:'progresso',
  title:'Conteúdo estudado e consolidação',
  oneLine:'Conteúdo estudado é quanto você já viu; consolidação é quanto realmente ficou.',
  summary:'Duas medidas diferentes de propósito.',
  keywords:'cobertura dominio consolidacao conteudo estudado percentual progresso diferenca',
  content:[
    { h:'Como funciona' },
    { p:'[[cobertura|Conteúdo estudado]] é a parte dos tópicos que você já estudou pelo menos uma vez. Consolidados são os tópicos que atingiram o status "dominado" (veja [[dominio|consolidação]]).' },
    { h:'Exemplo' },
    { p:'80% de conteúdo estudado com 20% consolidado normalmente indica que faltou revisar, não estudar: você passou por quase tudo, mas pouca coisa ficou.' },
    { note:'Só entram na conta os tópicos cadastrados em disciplinas ativas. Disciplinas arquivadas ficam de fora do cálculo atual, mas o histórico delas permanece.' }
  ],
  related:['analises-observacoes','relatorio']
},
{
  id:'creditos', section:'usar', group:'progresso',
  title:'O que são créditos',
  oneLine:'Uma unidade de acompanhamento definida por disciplina.',
  summary:'Cada disciplina decide quantos minutos valem 1 crédito.',
  keywords:'credito creditos minutos conversao unidade regra disciplina',
  content:[
    { h:'Como funciona' },
    { p:'Cada disciplina define quantos minutos valem 1 [[credito|crédito]] (o padrão é 20). Ao registrar 40 minutos numa disciplina de 20 min/crédito, o estudo vale 2 créditos.' },
    { h:'No Ciclo' },
    { p:'Você altera essa regra em Disciplinas → a disciplina → Editar → Mais opções. Créditos já registrados não mudam retroativamente: o valor histórico de cada estudo é preservado.' },
    { note:'Como a regra varia entre disciplinas, o planejamento e as comparações gerais trabalham em minutos.' }
  ],
  related:['analises-observacoes','relatorio']
},
{
  id:'analises-observacoes', section:'usar', group:'progresso',
  title:'Observações e tópicos que merecem atenção',
  oneLine:'Fatos calculados dos seus registros — sem adivinhar causas.',
  summary:'De onde saem as frases e como os tópicos são escolhidos.',
  keywords:'observacoes insights atencao fatos pontos calculado motivo',
  content:[
    { h:'Como funciona' },
    { p:'As observações são frases calculadas a partir dos seus registros, sempre as mesmas para os mesmos dados. Elas descrevem o que aconteceu ("Matemática recebeu 40% do tempo planejado") e nunca afirmam por quê.' },
    { h:'Tópicos que merecem atenção' },
    { p:'São escolhidos por fatos concretos — revisão atrasada, esquecimentos repetidos, pouca consolidação, prazo próximo, prioridade alta ainda não iniciada. A prioridade só ajuda a ordenar a lista.' }
  ],
  related:['relatorio']
},
{
  id:'como-o-ciclo-sugere', section:'usar', group:'progresso',
  title:'Como o Ciclo escolhe o que devo estudar',
  oneLine:'Uma pontuação local e determinística, sem nenhuma IA envolvida.',
  summary:'O que entra na conta da tela Hoje — e por que você não precisa obedecer.',
  keywords:'recomendacao sugestao hoje decidir proxima acao porque obedecer motivo escolher',
  content:[
    { h:'Como funciona' },
    { p:'A [[recomendacao|recomendação]] sai de um cálculo feito no seu navegador, com regras fixas. Não há IA, servidor nem aleatoriedade — com os mesmos dados, o resultado é sempre o mesmo.' },
    { h:'O que entra na conta' },
    { ul:[
      'Quanto falta da disciplina no plano da semana (é o fator de maior peso).',
      'A prioridade da disciplina.',
      'Há quantos dias você não a estuda.',
      'Se existe prazo próximo.',
      'Quantas revisões pendentes ela tem e há quanto tempo estão atrasadas.',
      'O quanto os tópicos já estão consolidados.',
      'Se você já passou bastante do tempo planejado — isso reduz a pontuação.'
    ]},
    { details:{ title:'Qual tópico é escolhido dentro da disciplina', content:[
      { ol:[
        'Tópico com revisão vencida.',
        'Tópico ainda pouco consolidado.',
        'Tópico em estudo sem contato há dias.',
        'O próximo ainda não iniciado, na sua ordem.'
      ]}
    ]}},
    { h:'Preciso obedecer?' },
    { p:'Não. A recomendação existe para poupar você de decidir quando bate a indecisão. Estudar outra coisa é perfeitamente válido e não gera penalidade nenhuma — em "Outras opções", a tela Hoje mostra também a 2ª e a 3ª sugestão, e "Por quê?" explica cada motivo.' },
    { note:'Os motivos sempre aparecem em texto claro, como "faltam 40min do plano semanal". O Ciclo não mostra a pontuação bruta porque o número em si não ajuda a decidir nada.' }
  ],
  cta:{ action:'openToday', label:'Abrir a tela Hoje' },
  related:['fila-revisao','planejamento','analises-observacoes']
},
{
  id:'relatorio', section:'usar', group:'progresso',
  title:'Copiar resumo e baixar relatório',
  oneLine:'Leve o período com você, em texto simples.',
  summary:'O que entra no arquivo .txt — e o que nunca entra.',
  keywords:'relatorio txt copiar resumo exportar baixar texto compartilhar semanal',
  content:[
    { h:'Como funciona' },
    { ul:[
      'No resultado de uma análise, o botão "Exportar" oferece as duas opções.',
      '"Copiar resumo" coloca na área de transferência um texto curto com o escopo, o período, o foco, o resumo, os números principais e os principais insights.',
      '"Baixar relatório (.txt)" gera um arquivo completo, com seções de Escopo, Período, Foco, Resumo, Prioridades, Tempo, Planejamento, Disciplinas, Tópicos, Revisões, Prazos e Observações.'
    ]},
    { h:'Exemplo' },
    { p:'O nome do arquivo segue o padrão ciclo-relatorio-matematica-2026-09-16.txt.' },
    { h:'Relatório semanal' },
    { p:'Em Explorar mais, "Semana a semana" mostra uma semana por vez, com setas para semanas anteriores. Ele é sempre calculado na hora, então nunca fica desatualizado.' },
    { note:'Os dois são gerados no seu navegador. Comentários dos estudos, orientações e anotações pessoais dos prazos nunca entram.' }
  ],
  related:['privacidade']
},

/* ----------------------------------------------------------- USAR · MEUS DADOS */
{
  id:'backup', section:'usar', group:'dados',
  title:'Como fazer backup',
  oneLine:'Um arquivo .json guarda tudo. É a única proteção do seu histórico.',
  summary:'Onde fica o botão, o que o arquivo contém e a diferença para o CSV.',
  keywords:'backup exportar json csv salvar copia seguranca arquivo planilha',
  content:[
    { h:'Como fazer' },
    { steps:[
      'Abra a tela Dados.',
      'Clique em "Exportar backup (.json)".',
      'Guarde o arquivo em algum lugar que não seja só este computador.'
    ]},
    { h:'O que o arquivo contém' },
    { p:'Tudo: áreas, disciplinas, tópicos, prioridades, estudos registrados, planos, semanas, prazos e configurações.' },
    { h:'JSON ou CSV?' },
    { ul:[
      'JSON — o [[backup|backup]] completo e restaurável. É o arquivo que traz seus dados de volta.',
      'CSV — apenas a lista de estudos, em formato de planilha. Serve para abrir no Excel ou no Google Sheets. Não restaura o Ciclo.'
    ]},
    { note:'A tela Dados mostra quando foi seu último backup e avisa discretamente quando faz muito tempo.' }
  ],
  cta:{ action:'backupNow', label:'Fazer backup agora' },
  related:['importar','mudar-computador','privacidade']
},
{
  id:'importar', section:'usar', group:'dados',
  title:'Importar e restaurar um backup',
  oneLine:'A importação substitui os dados atuais — e pede confirmação antes.',
  summary:'Como restaurar, e o que acontece se algo der errado no meio.',
  keywords:'importar restaurar backup json arquivo substituir confirmar versao antiga',
  content:[
    { h:'Como fazer' },
    { steps:[
      'Abra a tela Dados.',
      'Clique em "Importar" e escolha o arquivo .json.',
      'Confira o resumo do que será restaurado.',
      'Confirme.'
    ]},
    { h:'No Ciclo' },
    { p:'O Ciclo valida o conteúdo antes de gravar qualquer coisa. A restauração acontece em uma operação única: se algo der errado no meio do caminho, nada é apagado e os dados anteriores continuam onde estavam.' },
    { note:'Backups de versões anteriores, inclusive da época do Diário de Estudos, continuam sendo aceitos e são convertidos para o formato atual.' }
  ],
  cta:{ action:'openData', label:'Abrir a tela Dados' },
  related:['mudar-computador']
},
{
  id:'mudar-computador', section:'usar', group:'dados',
  title:'Como levar meus dados para outro computador',
  oneLine:'Exporte o JSON num, importe no outro. Não existe sincronização.',
  summary:'O procedimento, e por que ele é manual.',
  keywords:'mudar computador transferir migrar celular sincronizar sincronizacao dispositivo levar',
  content:[
    { h:'Como fazer' },
    { steps:[
      'No computador atual: Dados → Exportar backup (.json).',
      'Leve o arquivo como preferir — pendrive, nuvem, e-mail para você mesmo.',
      'No outro computador: abra o Ciclo, vá em Dados → Importar e escolha o arquivo.'
    ]},
    { h:'Por que não sincroniza' },
    { p:'Sincronizar exigiria guardar seus dados em um servidor e identificar você com uma conta. O Ciclo foi construído sem isso de propósito. O preço dessa escolha é que cada navegador tem sua própria cópia.' },
    { note:'O mesmo procedimento funciona para usar no celular. Depois disso, as duas cópias seguem independentes.' }
  ],
  related:['privacidade']
},
{
  id:'privacidade', section:'usar', group:'dados',
  title:'Onde meus dados ficam',
  oneLine:'Somente neste navegador, no seu computador. Sem conta e sem servidor.',
  summary:'Como o armazenamento funciona e o que pode apagá-lo.',
  keywords:'privacidade dados local navegador servidor conta nuvem online indexeddb limpar anonima telemetria',
  content:[
    { h:'Como funciona' },
    { p:'Tudo fica gravado no [[indexeddb]] do próprio navegador. Não existe conta, login, servidor de dados, sincronização, rastreamento nem telemetria. A página é configurada para bloquear conexões de rede e não usa bibliotecas, fontes ou scripts externos.' },
    { h:'O que pode apagar seus dados' },
    { ul:[
      'Limpar os dados do site, ou usar a opção "limpar tudo" do navegador.',
      'Desinstalar o navegador.',
      'Usar o Ciclo numa janela anônima — o que for registrado ali costuma sumir ao fechar.'
    ]},
    { note:'Esse espaço é separado por navegador e por perfil. Por isso os dados do Chrome não aparecem no Firefox.' },
    { h:'A contrapartida' },
    { p:'O backup é responsabilidade sua. Exportar o arquivo de vez em quando é o que protege o seu histórico.' }
  ],
  cta:{ action:'backupNow', label:'Fazer backup agora' },
  related:[]
},

/* ------------------------------------------------- USAR · NAVEGAÇÃO E ATALHOS */
{
  id:'telas', section:'usar', group:'navegacao',
  title:'Como o Ciclo está organizado',
  oneLine:'Nove telas, cada uma com um trabalho.',
  summary:'O que fica em cada tela.',
  keywords:'navegacao telas menu organizacao onde encontrar mais celular voltar buscar busca ordenar ordenacao filtro lista',
  content:[
    { ul:[
      'Hoje — o que estudar agora e o que vem a seguir.',
      'Planejamento — quanto tempo você tem por semana e como ele se divide.',
      'Revisões — o que revisar agora; as próximas ficam logo abaixo.',
      'Disciplinas — suas áreas, disciplinas e tópicos, como um índice; a aba Prazos mostra o que está chegando.',
      'Análises — escolha o que quer entender e gere uma análise sob medida.',
      'Histórico — todos os estudos, dia a dia, com busca e filtros.',
      'Ajuda — esta Central.',
      'Dados — backup, restauração e privacidade.',
      'Configurações — aparência, preferências de estudo, revisões e ajuda.'
    ]},
    { note:'No celular, Disciplinas, Histórico, Ajuda, Dados e Configurações ficam no botão "Mais".' },
    { h:'Voltar e encontrar' },
    { ul:[
      'Dentro de Disciplinas, o botão no topo diz para onde volta — por exemplo, "← Tecnologia". O Voltar do navegador faz o mesmo caminho e só depois sai do Ciclo.',
      'Ao voltar, a lista continua como você deixou: a mesma busca, a mesma ordem e a mesma posição.',
      'Cada lista busca só nela mesma: dentro de Tecnologia, disciplinas de Tecnologia; dentro de uma disciplina, os tópicos dela; em Prazos, prazos.',
      '"Ordenar por" reorganiza a lista (mais estudadas, prioridade, datas, nome) sem mudar nada nos seus dados. Em Prazos, o mesmo botão também filtra por situação.',
      'A busca "Buscar no Ciclo" (Ctrl + K), também usada na tela Hoje, procura em tudo e agrupa por tipo: disciplinas, tópicos, prazos, ações e ajuda.'
    ]}
  ],
  related:['atalhos','primeiros-passos']
},
{
  id:'atalhos', section:'usar', group:'navegacao',
  title:'Atalhos de teclado',
  oneLine:'Ctrl + K abre a busca de comandos e chega a qualquer lugar.',
  summary:'Todos os atalhos disponíveis no computador.',
  keywords:'atalho teclado tecla ctrl k esc comando busca navegar barra voltar',
  content:[
    { p:'Os atalhos funcionam quando você não está digitando em um campo de texto.' },
    { ul:[
      'Ctrl + K (ou ⌘ + K) — buscar no Ciclo inteiro: disciplinas, tópicos, prazos, ações, telas e ajuda.',
      '/ — vai para a busca da tela atual (por exemplo, a busca de tópicos dentro de uma disciplina).',
      'Alt + ← (ou o Voltar do navegador) — volta para o lugar anterior dentro do Ciclo.',
      'R — abre o registro de estudo. Com um cronômetro rodando, abre a finalização.',
      'H — vai para Hoje.',
      'P — vai para Planejamento.',
      'V — vai para Revisões.',
      'A — vai para Análises.',
      '? — abre a Central de Ajuda.',
      'Esc — fecha o que estiver aberto: busca, painel lateral, janela ou modo foco.'
    ]},
    { note:'Em qualquer busca, ↓ entra nos resultados, as setas navegam, Enter abre e Esc limpa o que foi digitado.' }
  ],
  related:['modo-foco']
},

/* ------------------------------------------- APRENDER · COMO APRENDER MELHOR? */
{
  id:'o-que-e-estudar', section:'aprender', group:'aprender-melhor',
  title:'O que significa aprender?',
  oneLine:'Aprender é trabalhar um conteúdo até conseguir usá-lo sem ter a fonte na frente.',
  summary:'A diferença entre ter visto um conteúdo e conseguir recuperá-lo.',
  keywords:'estudar aprender significado definicao o que e como aprender melhor',
  content:[
    { h:'Como funciona' },
    { p:'Estudar não é passar os olhos por um conteúdo. É trabalhar o material até conseguir recuperá-lo e usá-lo sem ter a fonte na frente.' },
    { h:'Por que importa' },
    { p:'Quem confunde "já vi isso" com "eu sei isso" costuma se surpreender na hora da prova ou da aplicação prática.' },
    { h:'Como fazer' },
    { steps:[
      'Escolha um pedaço pequeno do conteúdo.',
      'Entenda a lógica dele, não só as palavras.',
      'Feche o material e tente reproduzir.',
      'Confira, corrija e marque o que faltou.',
      'Volte a esse conteúdo depois de alguns dias.'
    ]},
    { h:'Exemplo' },
    { p:'Ler três páginas e fechar o livro conseguindo explicar a ideia central com suas palavras é estudar. Reler as três páginas quatro vezes, não necessariamente.' },
    { h:'No Ciclo' },
    { p:'Cada vez que você registra um [[sessao|estudo]], o Ciclo guarda quanto tempo e em que conteúdo. Se houver tópico, ele também agenda a revisão.' }
  ],
  related:['reconhecer-x-lembrar','recordacao-ativa']
},
{
  id:'reconhecer-x-lembrar', section:'aprender', group:'aprender-melhor',
  title:'Reconhecer não é lembrar',
  oneLine:'Ler a resposta e pensar "eu sabia" é diferente de conseguir produzi-la.',
  summary:'A principal armadilha de quem estuda relendo.',
  keywords:'reconhecer lembrar recuperar ilusao fluencia relendo reler por que nao basta reler',
  content:[
    { h:'Como funciona' },
    { p:'Reconhecimento é identificar a informação quando ela está na sua frente. Recuperação é produzi-la do zero. São habilidades diferentes, e só a segunda é cobrada numa prova ou numa aplicação real.' },
    { h:'Por que importa' },
    { p:'A releitura cria uma sensação de domínio que some quando o material fecha. Quanto mais fluente a leitura, mais forte a ilusão.' },
    { h:'Como fazer' },
    { ul:['Sempre que sentir "isso eu já sei", feche o material e tente explicar.','Se não sair, você estava reconhecendo, não lembrando.'] },
    { h:'Exemplo' },
    { p:'Você lê a definição de derivada e concorda com tudo. Depois, com a folha em branco, não consegue escrever a definição. Era reconhecimento.' },
    { h:'No Ciclo' },
    { p:'Por isso o resultado da revisão pergunta como foi LEMBRAR, e não se você leu o conteúdo.' }
  ],
  related:['recordacao-ativa','revisao-nao-e-reler']
},
{
  id:'recordacao-ativa', section:'aprender', group:'aprender-melhor',
  title:'Recordação ativa',
  oneLine:'Tente lembrar antes de consultar — é o que mais fortalece a memória.',
  summary:'O hábito com melhor retorno por minuto investido.',
  keywords:'recordacao ativa recuperacao active recall lembrar testar como lembrar melhor memorizar',
  content:[
    { h:'Como funciona' },
    { p:'[[recordacaoAtiva|Recordação ativa]] é tentar produzir a informação de memória, em vez de reler e reconhecer. O esforço de buscar na memória é justamente o que fortalece a memória.' },
    { h:'Como fazer' },
    { steps:[
      'Feche o material.',
      'Faça uma pergunta a si mesmo.',
      'Responda antes de conferir — em voz alta, por escrito ou mentalmente.',
      'Confira e corrija só os pontos que falharam.'
    ]},
    { h:'Exemplo' },
    { p:'Estudou OSPF? Antes de abrir as anotações, pergunte: "como se formam as adjacências?". Responda e só então confira.' },
    { h:'No Ciclo' },
    { p:'Ao iniciar uma revisão, escolha o método Recordação ativa. O Ciclo mostra o roteiro curto na tela.' }
  ],
  cta:{ action:'openReviews', label:'Abrir Revisões' },
  related:['flashcards-guia','explicacao-guia']
},
{
  id:'como-esquecemos', section:'aprender', group:'aprender-melhor',
  title:'Como a memória esquece',
  oneLine:'Esquecer é normal: sem retorno ao conteúdo, o acesso enfraquece com o tempo.',
  summary:'Por que planejar reencontros funciona melhor que "aprender de uma vez".',
  keywords:'esquecimento curva memoria esquecer retencao normal tempo',
  content:[
    { h:'Como funciona' },
    { p:'Depois de aprender algo, o acesso àquela informação tende a enfraquecer com o tempo, especialmente se você nunca mais a usa.' },
    { h:'Por que importa' },
    { p:'Entender isso muda a forma de estudar: em vez de tentar fixar tudo de uma vez, você planeja reencontros.' },
    { h:'Exemplo' },
    { p:'Um conteúdo visto uma única vez há dois meses costuma exigir quase um reestudo. O mesmo conteúdo revisado três vezes no período costuma voltar em poucos minutos.' },
    { h:'No Ciclo' },
    { p:'Os intervalos entre revisões existem justamente para pegar o conteúdo antes que ele fique difícil demais de recuperar.' },
    { note:'Não existe um número universal de quanto se esquece em 24h — isso depende do conteúdo, do estudo e da pessoa. O que é consistente é a tendência: sem retorno, o acesso enfraquece.' }
  ],
  related:['espacamento','quando-revisar']
},

/* ------------------------------------------------- APRENDER · COMO REVISAR? */
{
  id:'revisao-nao-e-reler', section:'aprender', group:'como-revisar',
  title:'Por que revisar (e por que revisar não é reler)',
  oneLine:'Revisar é testar a memória, não passar os olhos de novo.',
  summary:'O que fortalece a memória é o esforço de recuperar, não a exposição repetida.',
  keywords:'por que revisar reler releitura metodo formas revisao passar os olhos',
  content:[
    { h:'Como funciona' },
    { p:'Muita gente entende revisão como "passar os olhos de novo". Isso é a forma mais confortável e geralmente a menos eficiente.' },
    { h:'Por que importa' },
    { p:'O que fortalece a memória é o esforço de recuperar, não a exposição repetida ao texto. Uma revisão de 10 minutos tentando lembrar costuma render mais que 30 minutos relendo.' },
    { h:'Como fazer' },
    { ul:['Escolha um método ativo: lembrar, explicar, resolver ou escrever de memória.','Use a leitura apenas para conferir depois.'] },
    { h:'Exemplo' },
    { p:'Revisar Direito Constitucional pode ser responder "quais são os direitos fundamentais?" de memória, e só então conferir a lista.' },
    { h:'No Ciclo' },
    { p:'Cada revisão vem com um [[metodoRevisao|método de revisão]] sugerido e um roteiro curto. Você pode trocar quando quiser.' }
  ],
  related:['explicacao-guia','resumos-guia']
},
{
  id:'espacamento', section:'aprender', group:'como-revisar',
  title:'Repetição espaçada',
  oneLine:'Estudar o mesmo conteúdo em dias diferentes rende mais do que tudo de uma vez.',
  summary:'O mesmo tempo total, distribuído, produz memória mais duradoura.',
  keywords:'espacamento repeticao espacada spaced intervalo distribuir maratona vespera',
  content:[
    { h:'Como funciona' },
    { p:'[[repeticaoEspacada|Repetição espaçada]] é estudar o mesmo conteúdo em encontros separados por dias, em vez de repetir tudo num único bloco longo.' },
    { h:'Por que importa' },
    { p:'O mesmo tempo total distribuído costuma render memória mais duradoura do que concentrado. E o intervalo pode crescer conforme o conteúdo fica mais firme.' },
    { h:'Exemplo' },
    { p:'Quatro blocos de 30 minutos em quatro dias rendem mais que duas horas seguidas na véspera.' },
    { h:'No Ciclo' },
    { p:'É exatamente o que o Ciclo faz em "Quando revisar": escolher quando o conteúdo deve voltar.' }
  ],
  related:['consistencia-guia']
},
{
  id:'flashcards-guia', section:'aprender', group:'como-revisar',
  title:'Flashcards',
  oneLine:'Cartões de pergunta e resposta, bons para fatos e definições curtas.',
  summary:'Recordação ativa em formato rápido.',
  keywords:'flashcards cartoes anki memorizar vocabulario formulas datas',
  content:[
    { h:'Como funciona' },
    { p:'Um cartão tem a pergunta de um lado e a resposta do outro. Você responde antes de virar. É [[recordacaoAtiva|recordação ativa]] em formato rápido.' },
    { h:'Como fazer' },
    { ul:['Faça cartões curtos, com uma ideia por cartão.','Responda antes de virar.','Repita mais os que errou.'] },
    { h:'Exemplo' },
    { p:'Frente: "O que faz o protocolo ARP?" Verso: a resposta em uma frase. Ou, num idioma, a palavra de um lado e o significado do outro.' },
    { h:'No Ciclo' },
    { p:'O Ciclo não tem um sistema próprio de flashcards. Ele agenda a revisão e você usa papel ou o aplicativo que preferir — depois registra como foi.' }
  ],
  related:['resumos-guia']
},
{
  id:'explicacao-guia', section:'aprender', group:'como-revisar',
  title:'Explicar com suas próprias palavras',
  oneLine:'Se você não consegue explicar com palavras simples, ainda não entendeu.',
  summary:'A explicação revela rapidamente onde está a lacuna.',
  keywords:'explicacao explicar feynman ensinar simples palavras proprias',
  content:[
    { h:'Como funciona' },
    { p:'Você explica o conteúdo como se fosse para alguém que nunca ouviu falar dele: sem jargão e sem repetir a frase do livro.' },
    { h:'Por que importa' },
    { p:'É muito difícil explicar algo que você não entendeu. Os pontos em que você trava ou fica vago são exatamente as lacunas.' },
    { h:'Como fazer' },
    { steps:[
      'Escolha o conceito.',
      'Explique em voz alta ou por escrito, com palavras simples.',
      'Marque onde travou.',
      'Volte ao material só nesses pontos e explique de novo.'
    ]},
    { h:'Exemplo' },
    { p:'Tente explicar o que é uma VLAN para alguém que não é da área. Se você só consegue repetir a definição do livro, ainda não entendeu.' },
    { h:'No Ciclo' },
    { p:'Escolha o método "Explicação" ao revisar. O roteiro aparece na tela.' }
  ],
  related:['resumos-guia']
},
{
  id:'resumos-guia', section:'aprender', group:'como-revisar',
  title:'Resumo de memória',
  oneLine:'Resumo escrito de memória ensina; resumo copiado, quase nada.',
  summary:'Escrever sem olhar obriga a recuperar e organizar.',
  keywords:'resumo resumir anotacoes copiar memoria escrever folha branco',
  content:[
    { h:'Como funciona' },
    { p:'Você escreve de forma condensada o que entendeu — de preferência sem olhar o material. Depois abre o material só para conferir.' },
    { h:'Por que importa' },
    { p:'Copiar trechos é uma tarefa quase mecânica. Escrever de memória obriga a recuperar e organizar.' },
    { h:'Como fazer' },
    { steps:[
      'Primeiro escreva o que lembra.',
      'Depois abra o material.',
      'Complete o que faltou com outra cor ou marcação.',
      'Guarde o resumo para revisões futuras.'
    ]},
    { h:'Exemplo' },
    { p:'Um resumo de meia página feito de memória vale mais que cinco páginas copiadas do livro.' },
    { h:'No Ciclo' },
    { p:'Use o método "Resumo de memória" nas revisões e registre no comentário do estudo o que ficou de fora.' }
  ],
  related:['exercicios-guia']
},

/* ------------------------------------------------- APRENDER · COMO PRATICAR? */
{
  id:'exercicios-guia', section:'aprender', group:'praticar',
  title:'Exercícios',
  oneLine:'Resolver questões mostra rápido o que você ainda não sabe.',
  summary:'A forma mais direta de descobrir lacunas.',
  keywords:'exercicios questoes pratica resolver problemas listas simulado prova',
  content:[
    { h:'Como funciona' },
    { p:'Você resolve questões sem consultar a resposta de imediato e usa os erros como mapa de estudo.' },
    { h:'Por que importa' },
    { p:'Exercícios expõem lacunas que a leitura esconde, e treinam exatamente o que a prova cobra.' },
    { h:'Como fazer' },
    { steps:[
      'Resolva antes de olhar a solução.',
      'Marque o que errou.',
      'Revise só os pontos dos erros.',
      'Refaça depois de alguns dias.'
    ]},
    { h:'Exemplo' },
    { p:'Em vez de reler a teoria de integrais, resolva cinco integrais. Os erros mostram o que estudar.' },
    { h:'No Ciclo' },
    { p:'Classifique o estudo como "Exercícios" para acompanhar sua proporção entre teoria e prática nas Análises.' }
  ],
  related:['intercalada-guia','corrigir-erros']
},
{
  id:'intercalada-guia', section:'aprender', group:'praticar',
  title:'Prática intercalada',
  oneLine:'Misturar tipos de problema treina escolher a abordagem, não só executá-la.',
  summary:'Para quem acerta treinando e confunde os tipos na prova.',
  keywords:'intercalada interleaving misturar blocos tipos questoes embaralhar',
  content:[
    { h:'Como funciona' },
    { p:'Você faz exercícios de tipos diferentes misturados, o que obriga a escolher a abordagem antes de resolver.' },
    { h:'Por que importa' },
    { p:'Treinar um tipo por vez cria a ilusão de domínio: você já sabe o método antes de ler a questão. Na prova, isso não acontece.' },
    { h:'Como fazer' },
    { steps:['Junte dois ou três tipos relacionados.','Embaralhe a ordem.','Antes de resolver, identifique de que tipo é a questão.','Resolva e confira.'] },
    { h:'Exemplo' },
    { p:'Misture derivadas, integrais e limites numa mesma lista, em vez de fazer vinte de cada.' },
    { h:'No Ciclo' },
    { p:'Disciplinas com tipo de conteúdo "Resolução de problemas" tendem a receber este jeito de revisar nas sugestões automáticas.' }
  ],
  related:['corrigir-erros']
},
{
  id:'corrigir-erros', section:'aprender', group:'praticar',
  title:'Corrigir erros',
  oneLine:'O erro só ensina se você descobrir por que errou.',
  summary:'Conferir a resposta não é corrigir.',
  keywords:'erro errar corrigir gabarito conferir aprender com erro revisar erros',
  content:[
    { h:'Como funciona' },
    { p:'Conferir o gabarito e marcar "errei" não muda nada. A correção começa quando você identifica a causa: era um conceito, uma distração, um passo do procedimento ou uma leitura errada do enunciado.' },
    { h:'Como fazer' },
    { steps:[
      'Antes de olhar a resposta, anote o que você acha que fez.',
      'Confira e classifique o erro: conceito, procedimento, desatenção ou interpretação.',
      'Erros de conceito voltam para o estudo; erros de desatenção voltam para a prática.',
      'Refaça a questão do zero alguns dias depois, sem olhar a correção.'
    ]},
    { h:'Exemplo' },
    { p:'Errar uma integral por trocar o sinal é desatenção; errar por não reconhecer a substituição é conceito. As duas exigem respostas diferentes.' },
    { h:'No Ciclo' },
    { p:'Use o comentário do estudo para registrar o tipo de erro. Depois, o Histórico permite buscar por essa palavra.' }
  ],
  related:['sessoes-longas']
},

/* ------------------------------------------ APRENDER · COMO ORGANIZAR O TEMPO? */
{
  id:'sessoes-longas', section:'aprender', group:'tempo',
  title:'Quanto tempo deve durar um estudo',
  oneLine:'A duração importa menos do que o que você faz dentro dela.',
  summary:'Blocos curtos com recuperação ativa rendem mais que horas de leitura.',
  keywords:'quanto tempo sessao duracao longa curta bloco estudar horas minutos',
  content:[
    { h:'Como funciona' },
    { p:'Não existe uma duração certa. O que decide o resultado é o tipo de trabalho: 25 minutos tentando lembrar valem mais que duas horas passando os olhos.' },
    { h:'Como fazer' },
    { ul:[
      'Prefira blocos que você consegue sustentar com atenção real.',
      'Divida conteúdos grandes em partes com começo e fim.',
      'Termine cada bloco com uma tentativa de recuperar o que viu.'
    ]},
    { h:'Exemplo' },
    { p:'Em vez de "estudar Anatomia por 3 horas", marque "Sistema cardiovascular · 40 min" e termine explicando o trajeto do sangue sem olhar.' },
    { h:'No Ciclo' },
    { p:'O cronômetro não obriga nenhum formato: você escolhe o tempo e pode pausar quando precisar.' }
  ],
  related:['pomodoro-guia','descanso-guia']
},
{
  id:'pomodoro-guia', section:'aprender', group:'tempo',
  title:'Pomodoro',
  oneLine:'Pomodoro organiza sua atenção; não substitui revisar.',
  summary:'Uma técnica de gestão de atenção, não de memorização.',
  keywords:'pomodoro tempo atencao foco intervalos 25 minutos pausa tecnica',
  content:[
    { h:'Como funciona' },
    { p:'Você trabalha por um bloco fixo (tradicionalmente 25 minutos) e faz uma pausa curta, repetindo o ciclo.' },
    { h:'Por que importa' },
    { p:'Ajuda quem tem dificuldade de começar ou de sustentar atenção, e reduz a tentação de interromper a cada minuto.' },
    { h:'Como fazer' },
    { steps:['Escolha o que vai estudar antes de começar.','Estude o bloco inteiro sem interrupção.','Faça a pausa de verdade.','Repita.'] },
    { h:'Exemplo' },
    { p:'Três blocos de 25 minutos com pausas curtas podem render mais que duas horas com o celular ao lado.' },
    { h:'No Ciclo' },
    { p:'Use o cronômetro com blocos de 25 minutos se isso ajudar sua concentração. O [[modoFoco|modo foco]] ajuda a sustentar o bloco.' },
    { note:'Pomodoro organiza a atenção. Ele não substitui recordação ativa nem espaçamento — o que você faz dentro do bloco continua sendo o que determina o aprendizado.' }
  ],
  related:['consistencia-guia','descanso-guia']
},
{
  id:'consistencia-guia', section:'aprender', group:'tempo',
  title:'Consistência',
  oneLine:'Aparecer com frequência vale mais do que aparecer com intensidade.',
  summary:'Frequência vence intensidade quando o objetivo é lembrar daqui a meses.',
  keywords:'consistencia constancia rotina frequencia habito todo dia semana',
  content:[
    { h:'Como funciona' },
    { p:'Estudar com regularidade, mesmo em blocos pequenos, em vez de concentrar tudo em poucos dias.' },
    { h:'Por que importa' },
    { p:'Espaçamento só é possível se você aparece com frequência. Além disso, um plano sustentável sobrevive a semanas ruins.' },
    { h:'Como fazer' },
    { ul:[
      'Escolha uma carga semanal que você cumpre numa semana comum, não na melhor.',
      'Prefira cinco dias de 40 minutos a um dia de quatro horas.',
      'Aceite dias fracos sem abandonar a semana.'
    ]},
    { h:'Exemplo' },
    { p:'Trinta minutos por dia somam mais de 180 horas em um ano.' },
    { h:'No Ciclo' },
    { p:'O calendário nas Análises mostra seus dias ativos, e o plano é semanal justamente para não punir um dia perdido.' }
  ],
  related:['descanso-guia']
},
{
  id:'descanso-guia', section:'aprender', group:'tempo',
  title:'Descanso e atenção',
  oneLine:'Sono e pausas fazem parte do estudo, não são interrupções dele.',
  summary:'A capacidade de concentração é limitada e se recupera.',
  keywords:'descanso sono pausa atencao cansaco fadiga madrugada',
  content:[
    { h:'Como funciona' },
    { p:'A capacidade de concentração é limitada e se recupera com pausas e sono adequado.' },
    { h:'Por que importa' },
    { p:'Estudar exausto reduz a qualidade da recuperação e aumenta o tempo necessário para o mesmo resultado.' },
    { h:'Como fazer' },
    { ul:[
      'Faça pausas curtas entre blocos.',
      'Evite trocar a pausa por rolagem infinita de tela — isso cansa em vez de descansar.',
      'Trate o sono como parte da rotina de estudo.'
    ]},
    { h:'Exemplo' },
    { p:'Duas horas descansado costumam render mais que quatro horas arrastadas de madrugada.' },
    { h:'No Ciclo' },
    { p:'Se os seus estudos estão ficando longos e a [[dificuldade|dificuldade]] percebida subindo, isso costuma aparecer nas Análises.' }
  ],
  related:[]
}
];

/* =========================================================================
   FAQ — respostas curtas. Quando existe artigo, ele é linkado; a resposta
   nunca duplica o artigo inteiro.
   ========================================================================= */
const HELP_FAQ_GROUPS = [
  { id:'comecando',    label:'Começando' },
  { id:'estudando',    label:'Estudos' },
  { id:'revisoes',     label:'Revisões' },
  { id:'planejamento', label:'Planejamento' },
  { id:'analises',     label:'Análises' },
  { id:'dados',        label:'Dados e privacidade' }
];

const HELP_FAQ = [
  /* ---- começando ---- */
  { id:'faq-area', g:'comecando', article:'areas-de-estudo',
    q:'Preciso criar uma Área de Estudo?',
    a:'Não. Ela só organiza disciplinas relacionadas. Sem Área de Estudo, a disciplina aparece como "Sem área" e funciona normalmente.' },
  { id:'faq-topicos-antes', g:'comecando', article:'topicos',
    q:'Preciso cadastrar todos os tópicos antes de começar?',
    a:'Não. Dá para registrar estudos sem tópico algum. Os tópicos habilitam revisões, conteúdo estudado e consolidação, então vale cadastrá-los aos poucos.' },
  { id:'faq-cronometro', g:'comecando', article:'registro-manual',
    q:'Preciso usar o cronômetro?',
    a:'Não. O registro manual permite lançar data e minutos depois, inclusive de dias anteriores.' },
  { id:'faq-celular', g:'comecando', article:'mudar-computador',
    q:'Posso usar no celular?',
    a:'Pode, com todas as funções essenciais. A experiência é pensada primeiro para computador, mas o celular continua completo. Os dados, porém, não são compartilhados entre os aparelhos.' },
  { id:'faq-conta', g:'comecando', article:'privacidade',
    q:'Existe conta ou login?',
    a:'Não existe e não é necessário. O Ciclo abre direto e funciona sem internet.' },

  /* ---- estudos ---- */
  { id:'faq-obedecer', g:'estudando', article:'como-o-ciclo-sugere',
    q:'Preciso seguir a recomendação da tela Hoje?',
    a:'Não. Ela é um atalho para quando você não quer decidir o que estudar. Estudar outra coisa não gera penalidade nenhuma.' },
  { id:'faq-como-escolhe', g:'estudando', article:'como-o-ciclo-sugere',
    q:'Como o Ciclo escolhe o que devo estudar?',
    a:'Por uma pontuação calculada no seu navegador: o que falta no plano da semana, a prioridade, há quanto tempo você não estuda, prazos próximos e revisões pendentes. Os motivos sempre aparecem no card.' },
  { id:'faq-aba-fechada', g:'estudando', article:'cronometro',
    q:'O cronômetro continua se eu fechar ou atualizar a página?',
    a:'Sim. O tempo é calculado por marcação de horário, não por um contador na tela. Se ficar aberto muitas horas, o Ciclo pergunta o que fazer em vez de registrar tudo sozinho.' },
  { id:'faq-dias-sem-estudar', g:'estudando',
    q:'O que acontece se eu ficar alguns dias sem estudar?',
    a:'Nada é marcado como falha. As revisões daquele período ficam pendentes e as disciplinas não estudadas ganham mais peso na recomendação.' },
  { id:'faq-dificuldade-dominio', g:'estudando', article:'dominio',
    q:'Dificuldade e consolidação são a mesma coisa?',
    a:'Não. Dificuldade é o quanto um estudo pareceu difícil, informada por você na hora. Consolidação é o quanto o tópico ficou na memória ao longo do tempo, calculada pelos resultados das revisões.' },
  { id:'faq-arquivar', g:'estudando', article:'disciplinas',
    q:'Arquivar apaga meu histórico?',
    a:'Não. Arquivar tira do uso ativo e preserva tudo. Só a exclusão definitiva, que fica como ação secundária, remove os estudos registrados.' },
  { id:'faq-prioridade-diferenca', g:'estudando', article:'prioridade-topico',
    q:'Qual a diferença entre a prioridade da disciplina e a do tópico?',
    a:'A da disciplina define quanto tempo ela recebe na semana. A do tópico define a ordem dentro da disciplina, principalmente nas revisões. As duas usam a escala de 1 a 5.' },

  /* ---- revisões ---- */
  { id:'faq-revisoes-como', g:'revisoes', article:'o-que-e-revisao',
    q:'Como funcionam as revisões?',
    a:'Depois que você estuda um tópico, ele entra sozinho no ciclo. Quando chega a hora, o Ciclo avisa; você tenta lembrar antes de consultar e depois diz como foi. Sua resposta decide quando o tópico volta.' },
  { id:'faq-dominio', g:'revisoes', article:'dominio',
    q:'O que é consolidação?',
    a:'Uma estimativa, de 1 a 5, de quanto um tópico já está firme na memória, com base nos resultados das suas revisões. Começa em 2, sobe quando você lembra e cai quando esquece.' },
  { id:'faq-revisao-cedo', g:'revisoes', article:'resultados-revisao',
    q:'Por que uma revisão apareceu de novo tão cedo?',
    a:'Provavelmente o último resultado foi "Esqueci" (volta para o dia seguinte) ou "Lembrei com dificuldade" (o intervalo cresce pouco).' },
  { id:'faq-desativar-revisao', g:'revisoes', article:'desativar-revisao',
    q:'Posso desativar a revisão de um tópico?',
    a:'Sim, desmarcando "Incluir nas revisões" ao editar o tópico. Em Configurações também dá para desligar a inclusão automática de novos tópicos.' },
  { id:'faq-estrategia-metodo', g:'revisoes', article:'quando-revisar',
    q:'Qual a diferença entre "quando revisar" e "como revisar"?',
    a:'"Quando revisar" é o ritmo: em quantos dias o conteúdo volta. "Como revisar" é o que você faz na revisão (lembrar, resolver, explicar…). São escolhas independentes.' },
  { id:'faq-precisa-escolher', g:'revisoes', article:'quando-revisar',
    q:'Preciso escolher quando e como revisar cada tópico?',
    a:'Não. Tudo vem com padrões que funcionam: "Adaptativa" para quando revisar e "Automático" para como revisar. Você só mexe se quiser.' },
  { id:'faq-fila-grande', g:'revisoes', article:'fila-revisao',
    q:'Tenho muitas revisões atrasadas. Preciso fazer todas?',
    a:'Não. Em Revisões, use "Revisar por 20 min" ou "Escolher tempo", diga quanto tempo você tem e o Ciclo escolhe as mais importantes que cabem nesse tempo. O resto continua na fila.' },
  { id:'faq-metodo-mudou', g:'revisoes', article:'metodos-revisao',
    q:'Por que o jeito de revisar sugerido mudou?',
    a:'O Ciclo alterna entre as opções adequadas ao tipo de conteúdo da disciplina para variar a forma de revisar. Se a última revisão foi "esqueci", ele passa a sugerir recordação ativa.' },
  { id:'faq-dominei', g:'revisoes', article:'resultados-revisao',
    q:'Marcar "Dominei" sem ter dominado atrapalha?',
    a:'Sim. O intervalo cresce bastante e o conteúdo pode voltar tarde demais. Responder com honestidade é o que faz o sistema trabalhar a seu favor.' },

  /* ---- planejamento ---- */
  { id:'faq-estudar-mais', g:'planejamento', article:'planejado-realizado',
    q:'Posso estudar mais que o planejado?',
    a:'Pode. O plano é uma referência, não um teto. A disciplina que passou do previsto apenas perde peso na recomendação, para abrir espaço às que estão atrás.' },
  { id:'faq-plano-cumprido', g:'planejamento', article:'planejado-realizado',
    q:'O que significa "plano cumprido"?',
    a:'Quanto do tempo planejado foi realmente estudado no período. 100% é ter cumprido exatamente o previsto.' },
  { id:'faq-plano-obrigatorio', g:'planejamento', article:'planejamento',
    q:'O planejamento é obrigatório?',
    a:'Não. Sem ele o Ciclo continua sugerindo o que estudar, só com menos informação. Informar suas horas por semana melhora bastante as sugestões.' },
  { id:'faq-prazo-distante', g:'planejamento', article:'prazos-influencia',
    q:'Um prazo distante já muda minhas sugestões?',
    a:'Muito pouco. A influência cresce conforme a data se aproxima e depende da prioridade do prazo. Com data de início, ele só começa a pesar a partir dela.' },
  { id:'faq-criar-prazo', g:'planejamento', article:'prazos',
    q:'Como criar um prazo?',
    a:'Em Disciplinas, na aba Prazos, use "+ Prazo". Informe o tipo, o título e a data; ligar a uma disciplina e a um tópico é opcional, mas é o que faz o prazo influenciar as sugestões.' },

  /* ---- análises ---- */
  { id:'faq-creditos', g:'analises', article:'creditos',
    q:'O que são créditos?',
    a:'Uma unidade de acompanhamento por disciplina: cada uma define quantos minutos valem 1 crédito (padrão 20). Como a regra varia, o planejamento usa minutos.' },
  { id:'faq-analise-disciplina', g:'analises', article:'analises',
    q:'Como vejo as análises de uma só disciplina?',
    a:'Em Análises, escolha "Uma disciplina" na primeira pergunta. Também dá para clicar numa disciplina em qualquer gráfico e usar "Analisar só esta disciplina".' },
  { id:'faq-relatorio-comentarios', g:'analises', article:'relatorio',
    q:'O relatório .txt inclui meus comentários?',
    a:'Não. Ele traz números, nomes, prioridades e prazos. Comentários dos estudos e anotações pessoais ficam de fora.' },
  { id:'faq-frase-dia', g:'analises',
    q:'O que é a frase do dia?',
    a:'Uma frase curta sobre estudo que muda a cada dia. É escolhida localmente, sem internet, e pode ser desligada em Configurações → Interface e ajuda.' },

  /* ---- dados e privacidade ---- */
  { id:'faq-onde-dados', g:'dados', article:'privacidade',
    q:'Onde meus dados ficam?',
    a:'Apenas neste navegador, no seu computador. Não há servidor de dados, conta, sincronização nem telemetria, e a página bloqueia conexões de rede.' },
  { id:'faq-limpar-navegador', g:'dados', article:'privacidade',
    q:'O que acontece se eu limpar os dados do navegador?',
    a:'O histórico é apagado junto, sem como recuperar — a menos que você tenha um backup exportado. É a principal razão para exportar de tempos em tempos.' },
  { id:'faq-backup', g:'dados', article:'backup',
    q:'Como faço backup?',
    a:'Na tela Dados, clique em "Exportar backup (.json)" e guarde o arquivo fora deste computador. É o arquivo que restaura tudo.' },
  { id:'faq-json-csv', g:'dados', article:'backup',
    q:'Qual a diferença entre backup JSON e CSV?',
    a:'O JSON é o backup completo, o único que restaura o Ciclo. O CSV traz só a lista de estudos, para abrir em planilha.' },
  { id:'faq-outro-computador', g:'dados', article:'mudar-computador',
    q:'Como levo meus dados para outro computador?',
    a:'Exporte o backup JSON em Dados, leve o arquivo e importe no outro computador pela mesma tela. Não existe sincronização automática.' }
];

/** Sugestões mostradas quando a busca está vazia. Textos de gente, não de sistema. */
const HELP_SEARCH_SUGGESTIONS = [
  'Como começar',
  'Como funcionam as revisões?',
  'Como criar um prazo?',
  'O que é consolidação?',
  'Como fazer backup?',
  'Como usar Análises?'
];

/** Exemplos mostrados sob o campo de busca (nunca clicáveis como categoria). */
const HELP_SEARCH_EXAMPLES = ['como funciona revisão?', 'o que é consolidação?', 'como criar uma área?'];

/** Perguntas comuns destacadas na Home da Ajuda. */
const HELP_HOME_FAQ = ['faq-como-escolhe','faq-area','faq-revisoes-como','faq-dominio','faq-onde-dados'];

/* =========================================================================
   EXEMPLOS DE ORGANIZAÇÃO — fonte única, usada na demonstração interativa
   da estrutura. Várias áreas de propósito: o Ciclo não é de tecnologia.
   ========================================================================= */
const HIERARCHY_EXAMPLES = [
  { id:'tecnologia', label:'Tecnologia', area:'Tecnologia', discipline:'Redes de Computadores',
    topics:['Modelo OSI','VLAN','OSPF'],
    note:'Tecnologia reúne as disciplinas técnicas; OSPF é uma parte de Redes de Computadores.' },
  { id:'faculdade', label:'Faculdade', area:'Faculdade', discipline:'Direito Penal',
    topics:['Teoria do crime','Crimes contra o patrimônio'],
    note:'Faculdade reúne as matérias do curso; cada tema da ementa vira um tópico.' },
  { id:'escola', label:'Escola', area:'Escola', discipline:'História',
    topics:['Brasil Colônia','Era Vargas'],
    note:'Escola reúne as matérias; cada unidade do livro vira um tópico.' },
  { id:'idiomas', label:'Idiomas', area:'Idiomas', discipline:'Inglês',
    topics:['Present Perfect','Phrasal verbs'],
    note:'Um idioma pode virar uma Área quando você estuda gramática e conversação separadamente.' },
  { id:'musica', label:'Música', area:'Música', discipline:'Violão',
    topics:['Formação de acordes','Escalas'],
    note:'Funciona para qualquer aprendizado contínuo, não só para provas.' },
  { id:'ciencias', label:'Ciências', area:'Faculdade', discipline:'Anatomia',
    topics:['Sistema cardiovascular','Sistema nervoso'],
    note:'Conteúdo de memorização costuma render mais com flashcards e recordação ativa.' },
  { id:'concurso', label:'Concurso', area:'Concurso', discipline:'Direito Constitucional',
    topics:['Direitos fundamentais','Controle de constitucionalidade'],
    note:'Os tópicos podem seguir o edital, o que ajuda a enxergar o conteúdo já estudado.' }
];

/* =========================================================================
   AJUDA CONTEXTUAL — o "?" ao lado dos rótulos.
   `term` puxa o texto do glossário (fonte única). `tip` só existe quando o
   contexto pede uma frase diferente da definição geral.
   ========================================================================= */
const CONTEXT_HELP = {
  prioridade:       { term:'prioridade' },
  prioridadeTopico: { title:'Prioridade do tópico', article:'prioridade-topico',
                      tip:'A ordem dentro da disciplina: tópicos mais prioritários aparecem antes nas revisões. Não muda o tempo da disciplina.' },
  importancia:      { title:'Prioridade do tópico', article:'prioridade-topico',
                      tip:'A ordem dentro da disciplina, principalmente nas revisões.' },
  estrutura:        { title:'Área → Disciplina → Tópico', article:'estrutura-conteudo',
                      tip:'A área organiza (é opcional), a disciplina é o que você estuda e o tópico é uma parte dela. Ex.: Tecnologia › Redes de Computadores › OSPF.' },
  areaEstudo:       { term:'areaEstudo' },
  prazo:            { term:'prazo' },
  escopo:           { title:'O que analisar', article:'analises',
                      tip:'Escolha tudo, uma Área de Estudo, uma disciplina ou um tópico. Toda a página passa a considerar só essa escolha.' },
  periodo:          { title:'Período', article:'analises',
                      tip:'Os dias considerados nos números. "Esta semana" inclui os dias que ainda vão chegar.' },
  calendario:       { title:'Calendário', article:'calendario',
                      tip:'Clique em um dia para ver os detalhes, ou use "Selecionar intervalo" para escolher vários dias.' },
  atencao:          { title:'Tópicos que merecem atenção', article:'analises-observacoes',
                      tip:'Escolhidos por fatos: revisão atrasada, esquecimentos, pouca consolidação, prazo próximo.' },
  insights:         { title:'Observações', article:'analises-observacoes',
                      tip:'Fatos calculados dos seus registros. Descrevem o que aconteceu, sem supor causas.' },
  minimo:           { term:'minimoSemanal' },
  aderencia:        { title:'Plano cumprido', article:'planejado-realizado',
                      tip:'Quanto do tempo planejado foi realmente estudado.' },
  cobertura:        { title:'Conteúdo estudado', article:'cobertura-dominio',
                      tip:'A parte dos tópicos que você já estudou pelo menos uma vez.' },
  dominio:          { term:'dominio' },
  creditos:         { term:'credito' },
  revisao:          { title:'Revisão espaçada', article:'quando-revisar',
                      tip:'Tópicos estudados voltam para revisão em intervalos que se adaptam ao seu resultado.' },
  dificuldade:      { term:'dificuldade' },
  disponibilidade:  { term:'disponibilidade' },
  recomendacao:     { term:'recomendacao' },
  planosemana:      { title:'Semana atual', article:'plano-base',
                      tip:'Cada semana guarda o plano que valia nela; mudar o plano não reescreve o passado.' },
  distribuicao:     { title:'Distribuição', article:'distribuicao',
                      tip:'Respeita os mínimos, divide o resto por prioridade e fecha no total exato.' },
  tiposessao:       { title:'Tipo de estudo', article:'sessoes',
                      tip:'Classificar ajuda a ver a proporção entre teoria e prática.' },
  estrategia:       { term:'estrategiaRevisao' },
  metodo:           { term:'metodoRevisao' },
  natureza:         { term:'naturezaConteudo' }
};

/* =========================================================================
   AJUDA DESTA TELA — três respostas curtas: o que dá para fazer aqui,
   o que significa o que está na tela e qual o próximo passo.
   ========================================================================= */
const SCREEN_HELP = {
  today:      { title:'Hoje',
                intro:'Esta tela responde a uma pergunta: o que faz sentido estudar agora.',
                points:['A sugestão principal vem com um motivo em uma frase. "Por quê?" mostra todos os sinais usados.','"Outras opções" lista a 2ª e a 3ª sugestão.','"A seguir" reúne as revisões do dia, o andamento da semana e o próximo prazo.'],
                cta:{ action:'quickStart', label:'Começar a estudar agora' },
                articles:['como-o-ciclo-sugere','comecar-sessao','cronometro'] },
  plan:       { title:'Planejamento',
                intro:'Você diz quanto tempo tem por semana e o Ciclo distribui entre as disciplinas.',
                points:['A tela mostra a divisão da semana e quanto já foi feito.','"Ajustar" abre os detalhes: horas, prioridade, mínimo e minutos de cada disciplina.','A distribuição automática é só uma sugestão: tudo continua editável.','Cada semana guarda seu próprio registro histórico.'],
                articles:['planejamento','distribuicao','plano-base'] },
  reviews:    { title:'Revisões',
                intro:'Tópicos estudados voltam automaticamente para revisão, em intervalos que se adaptam.',
                points:['O que é para agora aparece primeiro, começando pelo que corre mais risco de ser esquecido.','"Revisar por 20 min" escolhe as mais importantes que cabem nesse tempo.','O resultado que você informa ajusta quando o tópico volta.','As próximas revisões ficam recolhidas no fim da tela.'],
                cta:{ action:'openReviews', label:'Ver a fila de revisões' },
                articles:['o-que-e-revisao','quando-revisar','metodos-revisao','fila-revisao'] },
  disciplines:{ title:'Disciplinas',
                intro:'Seus estudos organizados como um índice: Área → Disciplina → Tópico. Na aba Prazos, o que está chegando.',
                points:['Só a disciplina é obrigatória. A área é opcional e não tem prioridade.','Abra uma área para ver as disciplinas dela; abra uma disciplina para ver os tópicos. O botão no topo ("← Tecnologia") volta um nível — o Voltar do navegador também.','A busca procura só na lista aberta, e "Ordenar por" reorganiza sem mudar nada. Ao voltar, tudo continua como você deixou.','As barrinhas mostram a prioridade, de 1 a 5. Na página da disciplina ou do tópico, clique nelas para mudar.','Prazos próximos dão mais atenção à disciplina ou ao tópico ligado a eles.'],
                cta:{ action:'addDiscipline', label:'Adicionar uma disciplina' },
                articles:['estrutura-conteudo','topicos','prioridades','prazos'] },
  analytics:  { title:'Análises',
                intro:'Escolha o que analisar, o período e o que você quer ver. Depois clique em "Gerar análise".',
                points:['O resultado mostra um resumo, poucos números, um gráfico e os principais insights.','"Alterar análise" volta às escolhas sem perder o resultado atual.','"Explorar mais" guarda calendário, distribuição e outras visões — cada uma abre só quando você pedir.','"Exportar" copia um resumo ou baixa o relatório em .txt da análise atual.'],
                articles:['analises','analises-como-ler','calendario','relatorio'] },
  history:    { title:'Histórico',
                intro:'Todos os estudos registrados, organizados por dia.',
                points:['A busca procura só nos estudos registrados: disciplina, área, tópico e comentário, com ou sem acento.','"Filtros" abre um painel; os filtros ativos aparecem abaixo da busca e saem com um clique.','Clique num estudo para editar ou remover. Editar recalcula os créditos pela regra da disciplina.'],
                articles:['sessoes','registro-manual','creditos'] },
  data:       { title:'Dados',
                intro:'Backup, restauração e informações de privacidade.',
                points:['O backup (.json) restaura tudo; o CSV serve para planilha.','Restaurar substitui os dados atuais e pede confirmação.','Backups das versões anteriores continuam sendo aceitos.'],
                cta:{ action:'backupNow', label:'Fazer backup agora' },
                articles:['backup','importar','mudar-computador','privacidade'] },
  settings:   { title:'Configurações',
                intro:'Preferências organizadas em grupos: aparência, estudos, revisões, ajuda, dados e sobre.',
                points:['O tema Sistema acompanha a preferência do seu sistema operacional.','A densidade compacta reduz espaçamentos sem diminuir a fonte.','A ajuda contextual pode ser completa, discreta ou desativada — a Central de Ajuda continua acessível em qualquer opção.'],
                articles:['atalhos','telas'] },
  help:       { title:'Ajuda',
                intro:'Pesquise uma dúvida, ou escolha um dos dois caminhos: usar o Ciclo, ou aprender a estudar.',
                points:['A busca funciona sem acento e procura primeiro em artigos, perguntas e no glossário; depois mostra as funções do Ciclo relacionadas ("No Ciclo").','Use ↓ e ↑ para navegar nos resultados e Enter para abrir.','Termos com ponto de interrogação explicam o significado sem sair da página.'],
                articles:['primeiros-passos','telas'] }
};

/* =========================================================================
   DEMONSTRAÇÕES — sempre em memória. Nada aqui toca no IndexedDB.
   ========================================================================= */
const REVIEW_DEMO = {
  topic:'Present Perfect',
  discipline:'Inglês',
  intro:'Imagine que você estudou este tópico ontem. Hoje o Ciclo pergunta como foi lembrar dele.',
  outcomes:[
    { v:'forgot',     label:'Esqueci boa parte',   next:'amanhã',    mastery:'cai',           explain:'O tópico volta logo, porque você precisa reforçá-lo.' },
    { v:'hard',       label:'Foi difícil lembrar', next:'em 2 dias', mastery:'cai um pouco',  explain:'O intervalo cresce pouco: você lembrou, mas com esforço.' },
    { v:'remembered', label:'Lembrei bem',         next:'em 4 dias', mastery:'sobe',          explain:'O intervalo cresce, porque o conteúdo está se firmando.' },
    { v:'mastered',   label:'Estava fácil',        next:'em 7 dias', mastery:'vai ao máximo', explain:'O intervalo cresce bastante: você já domina isso.' }
  ],
  closing:'Você não precisa decidir nada além disso. O Ciclo cuida das datas.'
};

const PLAN_DEMO = {
  hours: 5,
  rows:[
    { name:'Matemática', priority:5, minutes:150 },
    { name:'Inglês',     priority:3, minutes:90 },
    { name:'História',   priority:2, minutes:60 }
  ],
  note:'Isso é apenas uma sugestão. Você pode mudar qualquer valor.'
};

/* =========================================================================
   COMECE POR AQUI — passos curtos e acionáveis, avaliados no estado real.
   ========================================================================= */
const HOW_TO_START = [
  { id:'discipline', title:'Adicione algo que você estuda',
    text:'Pode ser uma matéria, um idioma, uma certificação, um instrumento — qualquer coisa que você queira aprender.',
    example:'Matemática · Inglês · Anatomia · CCNA · Violão',
    action:'addDiscipline', actionLabel:'Adicionar agora' },
  { id:'session', title:'Comece a estudar',
    text:'Escolha o que vai estudar e quanto tempo. O Ciclo conta o tempo para você.',
    example:'Inglês · 20 minutos',
    action:'quickStart', actionLabel:'Começar a estudar' },
  { id:'topic', title:'Adicione tópicos aos poucos',
    text:'Tópicos são as partes de uma disciplina. Não precisa cadastrar tudo de uma vez.',
    example:'Matemática → Derivadas',
    action:'addTopic', actionLabel:'Adicionar tópico' },
  { id:'review', title:'O Ciclo avisa quando revisar',
    text:'Depois de estudar um tópico, ele volta sozinho no momento certo.',
    example:'Estudou hoje → revisa amanhã → depois em 4 dias…',
    action:'reviewDemo', actionLabel:'Ver como funciona' },
  { id:'plan', title:'Organize sua semana quando quiser',
    text:'Dizer quanto tempo você tem ajuda o Ciclo a distribuir melhor seus estudos.',
    example:'5 horas por semana',
    action:'plan', actionLabel:'Organizar semana' }
];

/**
 * Compatibilidade: as telas antigas chamam openInteractiveGuide('ig-…').
 * Cada guia interativo virou um artigo — com a mesma demonstração dentro.
 * Assim existe um único texto por conceito, e nenhuma porta extra.
 */
const LEGACY_GUIDE_TO_ARTICLE = {
  'ig-disciplina': 'disciplinas',
  'ig-topico':     'topicos',
  'ig-area':       'areas-de-estudo',
  'ig-sessao':     'sessoes',
  'ig-revisao':    'o-que-e-revisao',
  'ig-plano':      'planejamento',
  'ig-prioridade': 'prioridades',
  'ig-estrutura':  'estrutura-conteudo',
  'ig-prazo':      'prazos'
};

const CHANGELOG = [
  { v:'6.2', d:'Navigation & Findability. O Voltar do navegador passou a voltar dentro do Ciclo (tópico → disciplina → área → Disciplinas) e só depois sair; o Avançar também funciona, e recarregar a página mantém você no mesmo lugar. Toda página dentro de Disciplinas tem um "voltar" que diz o destino. A busca de cada tela procura só ali: áreas, disciplinas da área aberta, tópicos da disciplina, prazos, revisões ou estudos registrados; a busca geral (Ctrl + K e tela Hoje) agrupa os resultados por tipo, e a Ajuda mostra primeiro as respostas e depois as funções relacionadas. Listas ganharam "Ordenar por" (mais estudadas, prioridade, modificadas ou criadas recentemente, nome, ordem personalizada) e Prazos, um filtro por situação. Ao voltar, a busca, a ordem e a posição da lista continuam como estavam. Nenhum dado foi alterado.' },
  { v:'6.1', d:'Human Interface / Calm Structure. Disciplinas virou um índice navegável: Disciplinas → Área → Disciplina → Tópico, com caminho no topo (e "voltar" no celular). Uma área criada aparece mesmo vazia, com convite para adicionar a primeira disciplina; dá para criar a área no próprio formulário da disciplina, e renomear, arquivar ou excluir pela página da área. A prioridade ganhou um único símbolo para 1 a 5, em todo lugar, e pode ser mudada direto no detalhe. Linguagem mais simples em toda a interface ("Começar a estudar", "Registrar estudo", "Quando revisar", "Como revisar", "Consolidação"). Mais espaço, menos maiúsculas e movimento mais suave ao navegar. Nenhum dado foi alterado.' },
  { v:'6.0', d:'Zero Visual Noise. Nova linguagem visual, mais calma: menos caixas, bordas, cores e informação ao mesmo tempo, com mais hierarquia e espaço. Cada tela responde uma pergunta. Hoje mostra uma recomendação e o que vem a seguir; Revisões começa pelo que é para agora; Planejamento mostra a divisão da semana e guarda os detalhes em "Ajustar"; Disciplinas ganhou uma aba de Prazos; o Histórico virou uma leitura por dia, com filtros num painel; Configurações foi organizada em grupos. Análises foi reconstruída: primeiro você escolhe o que analisar, o período e o que quer ver; depois recebe um resumo, poucos números, um gráfico principal e os principais insights, com aprofundamento sob demanda em "Explorar mais". Nenhum dado foi alterado.' },
  { v:'5.3', d:'Central de Ajuda reconstruída: dois caminhos claros (Usar o Ciclo e Aprender a estudar), busca com navegação por teclado e resultados ranqueados, artigos com estrutura única e exemplos, glossário contextual que explica um termo sem tirar você da página, FAQ organizado por assunto e caminho de volta previsível em qualquer ponto.' },
  { v:'5.2.1', d:'Revisão geral de estabilidade, interface, integrações, acessibilidade e acabamento pré-lançamento. Seus dados, revisões, prazos e planos continuam exatamente como estavam.' },
  { v:'5.2', d:'Estrutura clara em três níveis: Área de Estudo → Disciplina → Tópico, com Área de Estudo opcional. Uma única escala de prioridade, de 1 (muito baixa) a 5 (muito alta), para disciplinas, tópicos e prazos — a antiga importância dos tópicos foi convertida automaticamente, sem mexer nas revisões. Prazos completos: tipo, data de início, status, orientações e anotações. Análises reconstruídas: escolha o que analisar e o período, leia o resumo, clique nos cartões para ver detalhes, use o calendário para ver um dia ou escolher um intervalo e baixe um relatório em texto.' },
  { v:'5.1', d:'O Diário de Estudos passa a se chamar Ciclo. Refinamento visual completo: novo sistema de cores e superfícies, temas escuro e claro reconstruídos, mais profundidade e uma linguagem de movimento consistente. Feedback mais claro depois de cada ação importante. Contato e relato de problema ficaram confiáveis: agora sempre é possível copiar o endereço ou o relato, mesmo sem um aplicativo de e-mail configurado.' },
  { v:'5.0', d:'Primeiro uso reconstruído: você adiciona o que estuda e começa em menos de dois minutos. Ajuda interativa com exemplos que funcionam de verdade, revisões guiadas e vocabulário em linguagem natural.' },
  { v:'4.0', d:'Revisões renovadas: estratégias, métodos com roteiro, fila inteligente e sessão de revisão por tempo disponível. Nova seção "Aprender a estudar", checklist "Comece por aqui" e frase do dia.' },
  { v:'3.1.1', d:'Correções na criação e no gerenciamento de áreas, e ajustes de estabilidade.' },
  { v:'3.1', d:'Central de Ajuda, ajuda contextual, busca de comandos (Ctrl+K), modo foco, tema Sistema, densidade compacta e refinamento da experiência no computador.' },
  { v:'3.0', d:'Planejamento semanal, revisão espaçada, recomendações explicáveis e armazenamento em IndexedDB.' },
  { v:'2.0', d:'Análises, insights determinísticos, tipos de sessão e dificuldade percebida.' }
];

const CONTACT_EMAIL = 'contatosantanafilipe@gmail.com';
