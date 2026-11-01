/**
 * Banco de Dados de Conteúdo Divertido para os Jogos da Resenha
 * Cada categoria contém dezenas de itens com humor autêntico para jovens adultos brasileiros.
 */

// Utilitário para baralho embaralhado sem repetição imediata
class ShuffleBag {
  constructor(items) {
    this.original = [...items];
    this.remaining = [];
    this.reset();
  }

  reset() {
    this.remaining = [...this.original];
    this.shuffle();
  }

  shuffle() {
    for (let i = this.remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.remaining[i], this.remaining[j]] = [this.remaining[j], this.remaining[i]];
    }
  }

  draw() {
    if (this.remaining.length === 0) {
      this.reset();
    }
    return this.remaining.pop();
  }
}

window.ResenhaData = {
  // Jogo 1: Garrafa (Verdades e Desafios)
  garrafa: {
    verdades: [
      "Qual foi a maior mentira que você já contou pros seus pais?",
      "Quem aqui na roda você levaria pra uma ilha deserta e por quê?",
      "Qual foi o rolê mais caótico do qual você se arrepende (ou quase foi preso)?",
      "Já stalkeou alguém usando fake no Instagram essa semana?",
      "Qual foi o pior beijo da sua vida e o que aconteceu?",
      "Se tivesse que beijar alguém dessa roda agora, quem seria?",
      "Qual é a coisa mais bizarra no seu histórico de navegação recente?",
      "Você já fingiu estar doente ou ocupado só pra não sair com alguém daqui?",
      "Qual é o seu 'contatinho proibido' que ninguém sabe?",
      "Já mandou mensagem bêbado(a) pro ex e se arrependeu no dia seguinte?",
      "Qual foi o mico mais vergonhoso que você já passou na frente de um crush?",
      "Qual a fofoca mais pesada sobre você que você morre de medo que descubram?",
      "Se todos aqui fossem pro BBB, quem seria o primeiro eliminado?",
      "Você já beijou mais de 3 pessoas na mesma noite?",
      "Qual é a sua mania secreta mais estranha quando ninguém está olhando?",
      "Qual amigo(a) seu(sua) tem o pior gosto pra relacionamento?",
      "Já foi pego no flagra fazendo algo constrangedor? O que era?",
      "Qual foi a desculpa mais esfarrapada que você já usou pra dar um bolo?",
      "Se pudesse trocar de vida com alguém dessa roda por um dia, quem seria?",
      "Qual foi a compra mais inútil que você já fez bêbado na internet?",
      "Você já teve um crush secreto no namorado(a) ou ex de algum amigo?",
      "Qual foi a última vez que você chorou e por que motivo bobo foi?",
      "Quem aqui você com certeza não deixaria cuidar do seu cachorro ou filho?",
      "Já fingiu saber falar outro idioma pra impressionar alguém?",
      "Qual foi a situação mais 'vergonha alheia' que você já presenciou num bar?",
      "Você já olhou o direct ou WhatsApp de alguém sem a pessoa saber?",
      "Se você fosse preso amanhã, o que seus amigos achariam que você fez?",
      "Qual comida esquisita você ama secretamente mas tem vergonha de admitir?",
      "Já teve um encontro tão ruim que inventou uma emergência pra fugir?",
      "Quem dessa roda demoraria mais pra sobreviver a um apocalipse zumbi?",
      "Qual foi a foto mais comprometedora que você já mandou sem querer?",
      "Qual segredo você levaria pro túmulo se não fosse essa rodada?",
      "Qual foi a maior quantia de dinheiro que você já perdeu em uma noitada?",
      "Quem aqui tem a risada mais engraçada ou bizarra?",
      "Se você tivesse que mandar um áudio de 15 segundos pro seu chefe agora, o que falaria?",
      "Qual foi o boato sobre você que era 100% mentira?",
      "Você já comeu algo que caiu no chão há mais de 5 minutos?",
      "Qual música você adora cantar no banho mas nunca colocaria no som da festa?",
      "Já deu match no Tinder com alguém só pela foto da comida ou do pet?",
      "Qual é o hábito mais tosco que você tem aos domingos à noite?",
      "Quem aqui seria seu cúmplice ideal em um golpe milionário?",
      "Você já chorou assistindo a um comercial de TV ou desenho animado?",
      "Qual foi a última mentira que você contou hoje?",
      "Se você pudesse apagar um relacionamento do seu passado, qual seria?",
      "Já dormiu em um lugar tão aleatório que acordou sem saber onde estava?",
      "Quem aqui na mesa fala mais alto quando toma duas doses?",
      "Qual apelido de infância você tenta esconder a todo custo?",
      "Você prefere ficar 1 mês sem celular ou 1 ano sem beber?",
      "Qual é o maior preconceito besta que você já teve e depois mudou de ideia?",
      "Diga uma qualidade e um defeito brutal da pessoa à sua esquerda!"
    ],
    desafios: [
      "Faça uma imitação dramática de alguém dessa roda até adivinharem!",
      "Ligue ou mande áudio no WhatsApp pra alguém falando: 'Só queria dizer que o pato nadou.' e não responda nada por 5 minutos!",
      "Tome 1 shot sem usar as mãos (apenas com a boca na mesa)!",
      "Coma uma colher cheia de condimento (ketchup/mostarda/maionese) ou beba 1 dose!",
      "Permita que a pessoa à sua direita poste qualquer emoji no seu Story do Instagram!",
      "Troque de camisa ou acessório com o jogador mais próximo até a próxima rodada!",
      "Faça 10 flexões gritando o nome de um personagem de desenho a cada repetição!",
      "Deixe a roda ler sua última mensagem recebida no WhatsApp em voz alta!",
      "Fale rimando durante as próximas duas rodadas completas. Se falar normal, toma shot!",
      "Dance funk/eletrônica sem música durante 30 segundos com cara séria!",
      "Finja que é um garçom chique e sirva as bebidas de todo mundo na mesa com elegância!",
      "Mantenha um cubo de gelo na boca até derreter completamente!",
      "Deixe a vítima escolher uma pessoa para te dar um apelido que você usará o resto do jogo!",
      "Conte uma piada ruim com a maior seriedade do mundo. Se alguém rir, quem riu bebe; se ninguém rir, você bebe!",
      "Faça uma declaração de amor apaixonada para uma garrafa ou objeto da sala!",
      "Coloque uma música aleatória do seu celular e faça um solo de guitarra imaginária no meio da sala!",
      "Faça massagem nos ombros do jogador à sua esquerda por 30 segundos!",
      "Envie um áudio de 5 segundos cantando 'Evidências' no grupo da família!",
      "Fique estátua por 1 minuto inteiro sem piscar ou sorrir enquanto tentam te desconcentrar!",
      "Imite o Faustão narrando a bebedeira da mesa por 30 segundos!",
      "Beba um gole da bebida de cada um dos jogadores da mesa!",
      "Tire uma selfie ridícula com a careta mais feia que puder e mande no grupo de amigos!",
      "Fale com sotaque diferente (francês, caipira, gaúcho ou gringo) até o seu próximo turno!",
      "Faça uma batalha de encarada com a pessoa à sua frente. Quem piscar ou rir primeiro bebe!",
      "Deixe alguém da roda desenhar uma tattoo falsa no seu braço com caneta!",
      "Grite na janela ou na porta: 'EU AMO A VIDA E O SHOT!'",
      "Mostre as últimas 3 fotos da sua galeria de fotos do celular para a mesa!",
      "Deixe outro jogador vasculhar seus aplicativos abertos por 15 segundos!",
      "Invente um aperto de mão secreto de 5 etapas com a pessoa à sua frente!",
      "Equilibre uma colher no nariz por 20 segundos. Se cair, toma shot!",
      "Tente lamber o próprio cotovelo por 15 segundos com toda dedicação!",
      "Ligue pro primeiro contato que começar com a letra 'M' e deseje Feliz Páscoa (mesmo fora de época)!",
      "Fale três qualidades sinceras e profundas sobre a pessoa que você menos conversa na roda!",
      "Dê uma cambalhota ou faça a pose da garça do Karate Kid por 30 segundos!",
      "Cante o refrão de uma música brega como se fosse uma ópera italiana!",
      "Deixe a pessoa à sua esquerda escolher a próxima música da playlist sem reclamação!",
      "Finja que está sendo entrevistado pelo Datena ao vivo na resenha por 40 segundos!",
      "Coloque as meias nas mãos e tente abrir uma garrafa ou copo assim!",
      "Coma uma rodela de limão pura fazendo cara de que é a coisa mais doce do mundo!",
      "Deixe o Juiz enviar um emoji de coração no último post de alguém aleatório no seu feed!",
      "Tome 2 goles de água seguidos sem engolir de vez enquanto os outros fazem cócegas!",
      "Apresente a sala como se fosse um corretor imobiliário vendendo uma mansão de luxo!",
      "Faça o moonwalk do Michael Jackson atravessando o cômodo!",
      "Escolha outro jogador para ser seu 'mestre' e repita tudo que ele fizer por 2 minutos!",
      "Invente um comercial de TV vendendo um chinelo velho como o produto do século!",
      "Beba o shot fazendo a famosa 'pose de galã de novela mexicana'!",
      "Abaixe e levante 15 vezes seguidas gritando 'BIRRL!'",
      "Deixe alguém mexer no seu cabelo e criar um penteado novo para você usar por 3 rodadas!",
      "Mande uma mensagem: 'Acho que esqueci o peixe no forno' para qualquer amigo e desligue a tela!",
      "Elogie calorosamente todos os jogadores da roda, um por um, sem rir!"
    ]
  },

  // Jogo 2: Quem é Mais Provável?
  provavel: {
    suave: [
      "Quem tem mais cara de ser preso por engano e achar divertido?",
      "Quem aqui esqueceria a própria mala na rodoviária ou aeroporto?",
      "Quem é mais provável de gastar todo o salário no primeiro dia do mês?",
      "Quem dormiria na balada sentado no sofá do lounge?",
      "Quem perderia a chave de casa dentro do próprio bolso?",
      "Quem é mais provável de adotar o 5º animal de rua sem avisar ninguém?",
      "Quem erra o caminho mesmo usando o Waze no volume máximo?",
      "Quem é o primeiro a sumir num festival de música?",
      "Quem tem mais cara de virar meme nacional sem querer?",
      "Quem é o amigo que mais cancela rolê de última hora?",
      "Quem sempre pede comida e depois come metade da comida dos outros?",
      "Quem ficaria amigo do barman e ganharia bebida grátis a noite toda?",
      "Quem tem mais chances de entrar no BBB e ser planta?",
      "Quem chora com qualquer filme infantil da Disney?",
      "Quem passaria 3 dias maratonando série sem tomar banho?",
      "Quem é mais provável de tropeçar no próprio pé na rua e disfarçar correndo?",
      "Quem nunca sabe que dia da semana é hoje?",
      "Quem mandaria um 'oi sumido' pro crush de 5 anos atrás?",
      "Quem é o primeiro a pedir água ou comida na resenha?",
      "Quem é mais provável de esquecer o aniversário do melhor amigo?",
      "Quem compraria uma Air Fryer parcelada em 18 vezes?",
      "Quem passaria vergonha cantando karaokê desafinado mas cheio de emoção?",
      "Quem seria enganado por um golpe de WhatsApp com a foto do Faustão?",
      "Quem esquece a panela no fogo e queima até miojo?",
      "Quem chega 2 horas atrasado e ainda diz: 'tô no elevador'?",
      "Quem tem mais probabilidade de ser expulso de um rodízio por comer demais?",
      "Quem perde o celular na própria mão?",
      "Quem tem o quarto mais desorganizado de todos?",
      "Quem é mais provável de virar monge ou largar tudo pra viver na praia?",
      "Quem começa a rir em momentos totalmente inapropriados?"
    ],
    resenha: [
      "Quem é mais provável de ligar pro ex bêbado(a) às 4 da manhã?",
      "Quem é o primeiro a dar PT (perda total) na festa?",
      "Quem gasta o dobro do combinado no Uber Black na volta da balada?",
      "Quem beijaria um desconhecido feio só pelo desafio?",
      "Quem sumiria do rolê e reapareceria misteriosamente em outra cidade?",
      "Quem dançaria em cima da mesa ou de uma cadeira sem ser convidado?",
      "Quem é mais provável de brigar com o segurança por causa de besteira?",
      "Quem é o rei/rainha do 'só mais uma saideira' e volta às 9 da manhã?",
      "Quem daria em cima do garçom ou da garçonete pra ganhar desconto?",
      "Quem acorda no dia seguinte sem lembrar onde colocou a carteira?",
      "Quem tem a pior história de ressaca moral da vida?",
      "Quem inventaria uma mentira absurda pra se livrar da blitz?",
      "Quem é o mais provável de trocar de grupo de amigos durante a balada?",
      "Quem vomitaria e continuaria bebendo como se nada tivesse acontecido?",
      "Quem beijaria duas pessoas rivais na mesma noite?",
      "Quem mandaria áudio vergonhoso no grupo do trabalho depois de beber?",
      "Quem é mais provável de entrar de penetra num casamento de luxo?",
      "Quem convenceria a galera inteira a ir pra um after duvidoso?",
      "Quem sempre chora na bebedeira falando que ama todo mundo?",
      "Quem perde o sapato na balada e volta descalço?",
      "Quem desafiaria o amigo a tomar um shot absurdo e tomaria junto?",
      "Quem roubaria uma placa de trânsito ou cone na volta pra casa?",
      "Quem finge que está sóbrio(a) quando a polícia passa perto?",
      "Quem se declara pro garçom achando que é o amor da vida?",
      "Quem sempre perde o casaco ou cartão de crédito na noitada?",
      "Quem é o amigo que promete que não vai beber e sai carregado?",
      "Quem é mais provável de acordar na casa de um estranho e pedir café?",
      "Quem faz amizade no banheiro da balada e vira melhor amigo de infância em 2 minutos?",
      "Quem é mais provável de fazer uma tatuagem bêbado e achar linda?",
      "Quem é o primeiro a mandar 'cade o after?' quando o bar fecha?"
    ],
    proibido: [
      "Quem é mais provável de ter uma pasta de nudes com mais de 500 fotos?",
      "Quem mandaria um nude pro contato errado da família por engano?",
      "Quem já ficou com dois amigos do mesmo círculo e escondeu?",
      "Quem toparia um 'ménage' sem pensar duas vezes se tivesse oportunidade?",
      "Quem é mais provável de ter uma conta secreta no OnlyFans ou privacy?",
      "Quem já mentiu sobre estar solteiro(a) pra conseguir um beijo na festa?",
      "Quem tem os fetiches mais estranhos e inconfessáveis da roda?",
      "Quem seria pego fazendo safadeza em local público (praia, carro, cinema)?",
      "Quem tem mais contatinhos arquivados no WhatsApp com nomes falsos?",
      "Quem voltaria com o pior ex tóxico por pura carência numa sexta-feira?",
      "Quem já furou o olho de alguém ou chegaria perto disso?",
      "Quem tem mais cara de ser o 'terror dos casados'?",
      "Quem beijaria alguém da roda agora se as luzes apagassem por 10 segundos?",
      "Quem tem o histórico de conversas mais proibido se abrissem na TV?",
      "Quem já fingiu clímax pra terminar a transa mais rápido?",
      "Quem já mandou mensagem picante e fingiu que foi 'sem querer querendo'?",
      "Quem sumiria com o crush pro banheiro no meio da festa dos outros?",
      "Quem é o mais provável de namorar duas pessoas ao mesmo tempo sem elas saberem?",
      "Quem tem cara de já ter feito loucuras num motel temático de beira de estrada?",
      "Quem já se apaixonou pela primeira pessoa que beijou na noite?",
      "Quem já fez chamada de vídeo picante na hora do almoço de domingo?",
      "Quem é mais safado(a) na teoria do que na prática?",
      "Quem já teve um crush proibido no sogro, sogra, tio ou professor?",
      "Quem mandaria nudes se oferecessem 100 reais no Pix agora?",
      "Quem tem cara de ter uma algema de pelúcia guardada na gaveta?",
      "Quem já usou aplicativo de relacionamento estando namorando?",
      "Quem ficaria com o ex do melhor amigo se ninguém nunca ficasse sabendo?",
      "Quem tem mais probabilidade de se casar em Las Vegas bêbado com uma stripper?",
      "Quem tem o passado amoroso mais perigoso da mesa?",
      "Quem não resistiria a uma recaída hoje à noite se recebesse um 'sumiu pq?'"
    ]
  },

  // Jogo 3: Eu Nunca
  eununca: {
    geral: [
      "Eu nunca fingi que estava falando ao telefone só pra evitar alguém na rua.",
      "Eu nunca usei a mesma meia dois dias seguidos fingindo que estava limpa.",
      "Eu nunca quebrei algo na casa de um amigo e escondi sem avisar.",
      "Eu nunca curti uma foto antiga do crush stalkeando sem querer.",
      "Eu nunca comi comida que caiu no chão depois da regra dos 5 segundos.",
      "Eu nunca peguei algo emprestado e nunca mais devolvi até esquecerem.",
      "Eu nunca menti minha idade pra entrar num lugar ou impressionar alguém.",
      "Eu nunca disse 'estou saindo de casa' quando ainda estava deitado na cama.",
      "Eu nunca pesquisei meus próprios sintomas no Google e achei que ia morrer.",
      "Eu nunca mandei print de conversa pra própria pessoa de quem tirei o print.",
      "Eu nunca cantei a letra de uma música completamente errada por anos.",
      "Eu nunca entrei no banheiro errado por distração.",
      "Eu nunca fingi conhecer uma banda famosa só pra não parecer burro.",
      "Eu nunca dei um presente que eu tinha recebido de outra pessoa e não gostei.",
      "Eu nunca derrubei o celular na própria cara enquanto estava deitado.",
      "Eu nunca fingi risada de uma piada que eu não entendi absolutamente nada.",
      "Eu nunca gastei todo meu dinheiro num lanche caro de madrugada.",
      "Eu nunca assisti a um filme inteiro só pela beleza do ator/atriz principal.",
      "Eu nunca usei o cupom de primeira compra criando outro e-mail falso.",
      "Eu nunca tentei consertar algo com fita isolante ou cuspe e piorou.",
      "Eu nunca chorei vendo vídeo de cachorro fofo no TikTok ou Reels.",
      "Eu nunca passei vergonha empurrando uma porta que era de puxar.",
      "Eu nunca comi uma caixa inteira de bis em menos de 10 minutos.",
      "Eu nunca fingi que não vi um conhecido no supermercado e mudei de corredor.",
      "Eu nunca esqueci a senha do meu próprio cartão no momento de pagar.",
      "Eu nunca criei um perfil fake no Twitter ou Instagram só pra xingar ou bisbilhotar.",
      "Eu nunca dancei sozinho na frente do espelho fingindo estar num clipe musical.",
      "Eu nunca tomei banho no escuro achando relaxante.",
      "Eu nunca mandei áudio e ouvi depois pra ver se minha voz estava bonita.",
      "Eu nunca tropecei na rua e comecei a correr fingindo que era esse o plano."
    ],
    relacionamentos: [
      "Eu nunca mandei mensagem pro ex dizendo que tinha sonhado com ele(a).",
      "Eu nunca dei match no Tinder só pra inflar o meu ego sem intenção de conversar.",
      "Eu nunca disse 'te amo' sem sentir só pra não deixar no vácuo.",
      "Eu nunca terminei um relacionamento por mensagem de texto ou WhatsApp.",
      "Eu nunca saí com alguém só porque a pessoa ia pagar a conta do jantar.",
      "Eu nunca me apaixonei por alguém que conheci na balada e esqueci o nome depois.",
      "Eu nunca dei um beijo triplo numa festa.",
      "Eu nunca beijei mais de 4 pessoas na mesma micareta ou bloquinho.",
      "Eu nunca voltei com ex mais de duas vezes (e quebrei a cara de novo).",
      "Eu nunca tive um crush obsessivo por um professor ou chefe.",
      "Eu nunca fui em um date ruim e pedi pra um amigo ligar com 'emergência'.",
      "Eu nunca stalkeei todos os seguidores novos do meu crush pra ver concorrentes.",
      "Eu nunca chorei ouvindo sertanejo ou pagode lembrando de quem não valia a pena.",
      "Eu nunca beijei alguém só de pirraça pra fazer ciúmes em outra pessoa.",
      "Eu nunca menti sobre meu signo só pra combinar com o do crush.",
      "Eu nunca namorei alguém só pra não ficar sozinho no dia dos namorados.",
      "Eu nunca olhei o celular de alguém escondido quando a pessoa foi ao banheiro.",
      "Eu nunca mandei a mesma cantada idêntica pra 3 contatinhos diferentes no mesmo dia.",
      "Eu nunca dei 'block' em alguém e desbloqueei 2 horas depois de arrependimento.",
      "Eu nunca beijei alguém e pensei em outra pessoa durante o beijo.",
      "Eu nunca menti sobre meu passado amoroso dizendo que era santo(a).",
      "Eu nunca dei uma chance pra alguém só pelo carro ou estilo da pessoa.",
      "Eu nunca mandei foto do almoço como desculpa pra puxar assunto aleatório.",
      "Eu nunca tive um 'amigo com benefícios' que virou ciúme tóxico.",
      "Eu nunca sonhei com alguém da roda em um contexto bem romântico ou quente.",
      "Eu nunca me declarei bêbado(a) e fingi amnésia no dia seguinte.",
      "Eu nunca saí escondido com ex depois de jurar pros amigos que nunca mais.",
      "Eu nunca mandei mensagem pro contatinho enquanto estava num date com outro.",
      "Eu nunca fingi que gostava do time de futebol do crush só pra ter assunto.",
      "Eu nunca passei a noite inteira conversando no telefone até a bateria acabar."
    ],
    vergonha: [
      "Eu nunca vomitei no Uber, táxi ou ônibus público.",
      "Eu nunca caí da cadeira ou do palco bêbado na frente de todo mundo.",
      "Eu nunca fui expulso de uma festa, bar ou balada por mau comportamento.",
      "Eu nunca dei em cima da mãe, pai, irmão ou irmã de um amigo próximo.",
      "Eu nunca arrotei ou soltei pum alto sem querer em silêncio constrangedor.",
      "Eu nunca rasguei a calça no meio de uma festa ou dança.",
      "Eu nunca acordei na sarjeta, chão da cozinha ou banheiro da festa.",
      "Eu nunca mandei foto sem roupa pro grupo da família ou do trabalho.",
      "Eu nunca esqueci as calças ou saia desabotoada o dia todo sem perceber.",
      "Eu nunca passei mal de tanto comer em rodízio até ter que desabotoar tudo.",
      "Eu nunca confundi uma grávida com alguém gordinha e passei vergonha.",
      "Eu nunca acenei de volta pra alguém na rua que na verdade acenava pra quem tava atrás.",
      "Eu nunca fui pego no flagra tirando meleca do nariz no trânsito.",
      "Eu nunca mandei um áudio falando mal de uma pessoa EXATAMENTE pra essa pessoa.",
      "Eu nunca tentei pagar a conta e o cartão foi recusado por falta de 5 reais.",
      "Eu nunca caí no chão tentando colocar a calça correndo atrasado.",
      "Eu nunca beijei alguém com bafo de cebola ou alho insuportável.",
      "Eu nunca confundi o carro de um estranho com o meu e tentei entrar no banco do passageiro.",
      "Eu nunca disse 'para você também' quando o garçom me desejou 'bom apetite'.",
      "Eu nunca fiquei com papel higiênico colado na sola do sapato na rua.",
      "Eu nunca me engasguei com a própria saliva e quase morri tossindo numa reunião.",
      "Eu nunca dei um abraço caloroso em alguém achando que era meu amigo e era um desconhecido.",
      "Eu nunca cantei desafinado de fone de ouvido alto achando que estava arrasando.",
      "Eu nunca quebrei um copo em restaurante e todo mundo aplaudiu.",
      "Eu nunca derrubei bebida na mesa toda durante um brinde animado.",
      "Eu nunca tomei um tombo monumental descendo de transporte público.",
      "Eu nunca fui pego cantando no chuveiro pela visita que já tinha chegado.",
      "Eu nunca tentei dar uma piscadinha sedutora e acertei uma careta de espasmo.",
      "Eu nunca ri tanto que espirrei bebida pelo nariz na frente dos outros.",
      "Eu nunca esqueci completamente o nome da pessoa com quem eu estava conversando há 1 hora."
    ],
    extremo: [
      "Eu nunca nadei pelado(a) em piscina, cachoeira ou praia com amigos.",
      "Eu nunca fiz safadeza dentro de um carro parado na rua.",
      "Eu nunca mandei nudes com meu rosto aparecendo claramente.",
      "Eu nunca fiz ménage à trois ou participei de uma suruba.",
      "Eu nunca transei no local de trabalho ou na faculdade.",
      "Eu nunca usei brinquedos adultos ou algemas no momento a dois.",
      "Eu nunca fiz um strip-tease completo pra alguém.",
      "Eu nunca gravei um vídeo íntimo com meu parceiro(a).",
      "Eu nunca transei na casa dos pais do crush enquanto eles dormiam no quarto ao lado.",
      "Eu nunca fiquei com duas pessoas da mesma família em épocas diferentes.",
      "Eu nunca tomei shot direto do umbigo ou corpo de alguém.",
      "Eu nunca tive um 'amigo secreto' que ninguém desconfia até hoje.",
      "Eu nunca fui pra uma praia de nudismo ou festa fetichista.",
      "Eu nunca transei ao ar livre correndo risco de ser visto por pedestres.",
      "Eu nunca fingi orgasmo escandaloso só pra acabar mais rápido.",
      "Eu nunca comprei algo em um sex shop online e escondi na gaveta secreta.",
      "Eu nunca beijei alguém do mesmo gênero só por curiosidade ou curtição na festa.",
      "Eu nunca fiz sexting durante o horário de expediente ou aula chata.",
      "Eu nunca beijei mais de 5 pessoas na mesma noite.",
      "Eu nunca tive uma fantasia tão bizarra que nunca contei pra nenhum ser vivo.",
      "Eu nunca passei a mão onde não devia fingindo que foi sem querer na multidão.",
      "Eu nunca fiz maratona de três rounds seguidos sem descanso.",
      "Eu nunca usei chantilly, chocolate ou gelo em momentos quentes.",
      "Eu nunca mandei mensagem bêbado pedindo nude pra quem não devia.",
      "Eu nunca perdi uma peça íntima numa noitada e nunca mais achei.",
      "Eu nunca transei em uma festa ou balada enquanto o rolê rolava na sala.",
      "Eu nunca mandei um 'vem aqui agora' às 3 da manhã só pra uma coisa rápida.",
      "Eu nunca tomei pílula do dia seguinte ou comprei pra parceira no desespero.",
      "Eu nunca tive um caso com alguém casado(a) ou comprometido(a).",
      "Eu nunca acordei pelado sem lençol num quarto desconhecido."
    ]
  },

  // Jogo 4: Copo do Rei (Regras de cada carta)
  copoDoRei: {
    cards: [
      {
        value: "A",
        name: "Ás",
        rule: "Cascata (Cachoeira)",
        desc: "Você começa a beber continuamente. A pessoa à sua esquerda só pode parar quando você parar, e a próxima quando a anterior parar! Todos bebem em correnteza!"
      },
      {
        value: "2",
        name: "Dois",
        rule: "Você Escolhe",
        desc: "Aponte o dedo para quem você quer que tome um gole ou shot. Pode ser dividido ou tudo pra uma vítima só!"
      },
      {
        value: "3",
        name: "Três",
        rule: "Você Bebe",
        desc: "A sorte não estava do seu lado: dê um belo gole na sua própria bebida imediatamente!"
      },
      {
        value: "4",
        name: "Quatro",
        rule: "Mão no Chão!",
        desc: "O último jogador a abaixar e encostar a mão no chão deve tomar um shot!"
      },
      {
        value: "5",
        name: "Cinco",
        rule: "Dedo pro Teto!",
        desc: "Todos devem apontar o dedo indicador para o teto/céu. A pessoa mais lenta bebe!"
      },
      {
        value: "6",
        name: "Seis",
        rule: "Duelo de Rimas",
        desc: "Você diz uma palavra. O próximo em sentido horário deve rimar com ela em 3 segundos. Quem repetir, gaguejar ou travar toma shot!"
      },
      {
        value: "7",
        name: "Sete",
        rule: "Parça de Copo",
        desc: "Escolha um amigo para ser seu 'gêmeo de copo'. Pelo resto do jogo, toda vez que você tiver que beber, ele(a) bebe junto!"
      },
      {
        value: "8",
        name: "Oito",
        rule: "Categoria / Stop",
        desc: "Você escolhe um tema (ex: marcas de carro, times, posições). Em sentido horário, cada um cita um item sem repetir. Quem demorar 4 segundos bebe!"
      },
      {
        value: "9",
        name: "Nove",
        rule: "Mestre do Silêncio",
        desc: "Você ganha o passe do Silêncio ou Banheiro: só pode falar ou ir ao banheiro quando alguém quebrar o tabu. Ou: a primeira pessoa que falar 'beber' toma dose!"
      },
      {
        value: "10",
        name: "Dez",
        rule: "Invente uma Regra Oficial",
        desc: "Você é a autoridade! Crie uma regra válida para o resto da partida (ex: só pode segurar o copo com a mão esquerda, proibir chamar pelo nome real). Quem quebrar, bebe!"
      },
      {
        value: "J",
        name: "Valete",
        rule: "Dama das Perguntas",
        desc: "Você só pode se comunicar fazendo perguntas. Se alguém responder a uma pergunta sua diretamente sem fazer outra pergunta de volta, essa pessoa bebe!"
      },
      {
        value: "Q",
        name: "Dama",
        rule: "Olhar Mortal (Medusa)",
        desc: "Em qualquer momento do jogo, você pode olhar fixamente nos olhos de alguém e piscar. Se a pessoa te encarar de volta por 2 segundos sem desviar o olhar, ela bebe!"
      },
      {
        value: "K",
        name: "Rei",
        rule: "Copo do Rei!",
        desc: "Derrama uma boa dose da sua bebida no COPO DO REI central! Se for o 4º e ÚLTIMO REI da partida, você VIRA O COPO DO REI INTEIRO imediatamente!"
      }
    ],
    suits: ["♠", "♥", "♦", "♣"]
  },

  // Jogo 5: Bomba-Relógio (Categorias dinâmicas rápidas)
  bomba: [
    "Marcas famosas de cerveja ou destilado",
    "Desculpas esfarrapadas pra chegar atrasado no trabalho",
    "Coisas que você esconde dos seus pais",
    "Mentiras comuns contadas em primeiro encontro",
    "Coisas com cheiro muito ruim",
    "Palavras que rimam com 'Coração'",
    "Coisas que você encontra dentro de uma bolsa feminina",
    "Motivos idiotas para terminar um namoro",
    "Coisas que você faz no banheiro quando ninguém tá olhando",
    "Pessoas famosas que começam com a letra B",
    "Coisas que dão muita ressaca",
    "Comidas que são vendidas em porta de balada às 5h da manhã",
    "Coisas que você não gostaria de encontrar debaixo da sua cama",
    "Apelidos carinhosos cafonas (ex: mozão, tchutchuco)",
    "Vilões clássicos de filmes ou desenhos",
    "Marcas de carro que existem no Brasil",
    "Coisas que você nunca deve falar no enterro de alguém",
    "Palavras que começam com a letra 'P'",
    "Lugares péssimos para levar um date no primeiro encontro",
    "Coisas que você pode comprar por menos de 5 reais",
    "Prazos que os brasileiros sempre deixam pro último dia",
    "Coisas que irritam muito no trânsito",
    "Artistas ou bandas de sertanejo universitário",
    "Coisas que têm gosto de infância",
    "Superpoderes inúteis se você tivesse que escolher um",
    "Coisas que você faz quando a internet cai",
    "Personagens de anime ou quadrinhos",
    "Coisas que não combinam com pizza de jeito nenhum",
    "Profissões perigosas ou estressantes",
    "Coisas que você encontra no porta-luvas de um carro",
    "Cores que não existem na bandeira do Brasil",
    "Músicas clássicas que todo mundo canta no karaokê bêbado",
    "Coisas que você faz bêbado e se arrepende no dia seguinte",
    "Nomes de cachorro mais comuns do Brasil",
    "Ingredientes que vão numa feijoada completa",
    "Coisas que você faria se ganhasse 100 milhões na Mega-Sena",
    "Coisas que você nunca deve emprestar pra um amigo",
    "Coisas que têm na casa de toda vó brasileira",
    "Tipos de bebidas alcoólicas diferentes",
    "Frases clássicas de mãe brava",
    "Países da Europa que você visitaria",
    "Coisas que você esquece em casa com frequência",
    "Programas de TV dos anos 90 e 2000 que marcaram época",
    "Coisas grudentas ou nojentas",
    "Animais com quatro patas que você não teria como pet",
    "Coisas que você fala pro médico mentindo",
    "Filtros ou trends do TikTok que ninguém aguenta mais",
    "Coisas que você guarda na geladeira mas não devia",
    "Desculpas pra faltar na academia na segunda-feira",
    "Coisas que você odeia quando vai ao banco"
  ],

  // Jogo 6: Quem Sou Eu? (Modo "Na Testa" / Heads Up)
  naTesta: {
    caos: [
      "Faustão", "Goku", "Coxinha", "Pikachu", "Neymar", "Shrek",
      "Xuxa", "Bob Esponja", "Miojo", "Havaianas", "Batman", "Anitta",
      "Air Fryer", "Casimiro", "Gato Siamês", "Darth Vader", "Tiririca",
      "Capivara", "Chaves", "Pão de Queijo", "Homem-Aranha", "Ronaldinho Gaúcho",
      "Luva de Pedreiro", "Barbie", "Tubarão", "Super Mario", "Silvio Santos",
      "Caneta Azul", "Bebê Chorão", "Juliette", "Galinha Pintadinha", "Whindersson",
      "Vampiro", "Cachorro Caramelo", "Monet", "Pablo Marçal", "Garçom Bêbado"
    ],
    games_anime: [
      "Goku", "Naruto", "Pikachu", "Monkey D. Luffy", "Kratos", "Sonic",
      "Super Mario", "Zelda", "Link", "Steve (Minecraft)", "Master Chief",
      "Sasuke", "Lara Croft", "Eren Yeager", "Saitama", "Donkey Kong",
      "Geralt de Rívia", "Ash Ketchum", "Leon Kennedy", "Tanjiro Kamado",
      "Mega Man", "Kirby", "Sub-Zero", "Scorpion", "Chun-Li", "Sephiroth",
      "Pac-Man", "Crash Bandicoot", "Satoru Gojo", "Edward Elric", "Levi Ackerman",
      "Vegeta", "Sans (Undertale)", "Trevor (GTA V)", "CJ (Carl Johnson)"
    ],
    filmes_series: [
      "Shrek", "Harry Potter", "Darth Vader", "Bob Esponja", "Wandinha",
      "Homem de Ferro", "Coringa", "Eleven (Stranger Things)", "Jack Sparrow",
      "Thanos", "Michael Scott", "Barbie", "Voldemort", "Senhor Miagui",
      "Walter White", "Mickey Mouse", "Batman", "Yoda", "Buzz Lightyear",
      "Dona Hermínia", "Wolverine", "Groot", "Frodo Bolseiro", "Homer Simpson",
      "Elsa (Frozen)", "Neo (Matrix)", "John Wick", "Professor (La Casa de Papel)",
      "Pica-Pau", "Scooby-Doo", "Patrik Estrela", "Capitão América", "Thor"
    ],
    comidas_objetos: [
      "Coxinha com Catupiry", "Havaianas", "Air Fryer", "Miojo de Galinha Caipira",
      "Pão de Queijo", "Churrasqueira Elétrica", "Brigadeiro de Panela", "Filtro de Barro",
      "Garrafa Térmica", "Pastel de Feira", "Chinelo Rider", "Guaraná Antárctica",
      "Controle Remoto com Durex", "Cuscuz Paulista", "Copo Americano", "Açaí com Leite Ninho",
      "Panela de Pressão", "Farofa de Bacon", "Bolo de Cenoura", "Vassoura de Piaçava",
      "Fone de Ouvido Embolado", "Bomba de Tereré", "Carregador de iPhone quebrado",
      "Picolé de Milho Verde", "Tupperware Manchada", "Guarda-Chuva Furado"
    ],
    memes_br: [
      "Casimiro (Meteu Essa?)", "Luva de Pedreiro (Receba!)", "Faustão (Errou!)",
      "Manoel Gomes (Caneta Azul)", "Inês Brasil", "Gretchen", "Cachorro Caramelo",
      "Neymar Rolando", "Bambam (BIRRL!)", "Belo", "Glória Maria na Jamaica",
      "Grávida de Taubaté", "Xamuel (Rima)", "Tiririca", "Monark", "Menino do Acre",
      "Joel Santana Falando Inglês", "Ana Maria Braga com Louro José", "Gugu no Táxi do Gugu",
      "Evaristo Costa", "Ednaldo Pereira", "Bora Bill", "Meme do Caixão", "Doutora Deolane",
      "Jojo Todynho", "Narcisa Tamborindeguy (Ai que loucura!)", "Rodrigo Faro (Dança Gatinho)"
    ]
  }
};
