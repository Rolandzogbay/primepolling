<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-6">
    <div class="relative mb-8">
      <h1 class="text-[12rem] font-black text-gray-100 leading-none select-none">
        404
      </h1>
      <p class="absolute inset-0 flex items-center justify-center text-5xl font-bold text-emerald-600">
        Oops!
      </p>
    </div>

    <div class="max-w-md text-center">
      <h2 class="text-3xl font-bold text-gray-800 mb-4 font-ubuntu">
        Lost in the Ballot Box?
      </h2>
      <p class="text-gray-500 text-lg mb-8">
        The page you are looking for has been disqualified or doesn't exist. 
        Check the URL or return to the main dashboard to cast your vote.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/" 
          class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-200 active:scale-95"
        >
          <i class="fa-solid fa-arrow-left"></i>
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-ubuntu {
  font-family: 'Ubuntu', sans-serif;
}

h1 {
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>
